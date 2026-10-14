// Network egress for sandboxed agent runs. The sandbox has no network of its own (bwrap --unshare-net);
// its only way out is an HTTP CONNECT proxy that this process serves on a Unix socket mounted into
// the sandbox. The proxy tunnels only to an allowlist of model-API hosts and logs every request,
// allowed or denied, to <runDir>/network.log. Inside the sandbox a tiny forwarder (FORWARDER below)
// listens on 127.0.0.1:PROXY_PORT and relays to the socket; the CLI is started with HTTPS_PROXY set.
// Both relays honor backpressure: bytes a socket did not accept are queued and flushed on drain.

import { appendFileSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const PROXY_PORT = 18080;

/** Hosts the agent CLIs need to reach their model APIs and refresh their own auth. Nothing else. */
export const ALLOW: Record<string, string[]> = {
  claude: ["api.anthropic.com", "platform.claude.com", "console.anthropic.com"],
  codex: ["chatgpt.com", "api.openai.com", "auth.openai.com"],
};

export interface Egress { socketDir: string; socketPath: string; stop: () => void }

/** Shared by host proxy and in-sandbox forwarder (also embedded in FORWARDER as source). */
const PIPE_SRC = `
function makePipe() {
  const q = new Map();
  return {
    write(sock, data) {
      let buf = q.get(sock);
      if (buf && buf.length) { buf.push(new Uint8Array(data)); return; }
      const n = sock.write(data);
      if (n < data.byteLength) { q.set(sock, [new Uint8Array(data).subarray(Math.max(n, 0))]); }
    },
    drain(sock) {
      const buf = q.get(sock);
      while (buf && buf.length) {
        const d = buf[0];
        const n = sock.write(d);
        if (n < d.byteLength) { buf[0] = d.subarray(Math.max(n, 0)); return; }
        buf.shift();
      }
      if (sock.__endAfterDrain) sock.end();
    },
    end(sock) { const buf = q.get(sock); if (buf && buf.length) sock.__endAfterDrain = true; else sock.end(); },
  };
}`;
// eslint-disable-next-line no-new-func
const makePipe = new Function(`${PIPE_SRC}; return makePipe;`)() as () => { write: (s: any, d: Uint8Array | string) => void; drain: (s: any) => void; end: (s: any) => void };

/** Start the proxy in a separate bun process (so blocking work in the caller cannot stall agent traffic). */
export function spawnEgressProxy(runDir: string, allow: string[]): Egress {
  const socketDir = mkdtempSync(join(tmpdir(), "folio-egress-"));
  const socketPath = join(socketDir, "proxy.sock");
  const child = Bun.spawn(["bun", join(import.meta.dir, "cli/egress-server.ts"), runDir, allow.join(","), socketDir], { stdout: "ignore", stderr: "ignore" });
  for (let i = 0; i < 200 && !existsSync(socketPath); i++) Bun.sleepSync(25);
  if (!existsSync(socketPath)) throw new Error("egress proxy did not start");
  return { socketDir, socketPath, stop: () => child.kill() };
}

export function startEgressProxy(runDir: string, allow: string[]): Egress {
  return startEgressProxyAt(runDir, allow, mkdtempSync(join(tmpdir(), "folio-egress-")));
}

export function startEgressProxyAt(runDir: string, allow: string[], socketDir: string): Egress {
  const socketPath = join(socketDir, "proxy.sock");
  const log = (line: string) => appendFileSync(join(runDir, "network.log"), `${new Date().toISOString()} ${line}\n`);
  const pipe = makePipe();
  type State = { buf: Uint8Array; up?: any; connecting?: boolean; pending: Uint8Array[] };
  const server = Bun.listen<State>({
    unix: socketPath,
    socket: {
      open(s) { s.data = { buf: new Uint8Array(0), pending: [] }; },
      drain(s) { pipe.drain(s); },
      async data(s, chunk) {
        const st = s.data;
        if (st.up) { pipe.write(st.up, chunk); return; }
        if (st.connecting) { st.pending.push(new Uint8Array(chunk)); return; }
        const merged = new Uint8Array(st.buf.length + chunk.length); merged.set(st.buf); merged.set(chunk, st.buf.length); st.buf = merged;
        const text = new TextDecoder("latin1").decode(st.buf);
        const end = text.indexOf("\r\n\r\n");
        if (end < 0) return;
        const first = text.slice(0, text.indexOf("\r\n"));
        const m = first.match(/^CONNECT ([^:\s]+):(\d+) HTTP\/1\.[01]$/);
        if (!m) { log(`DENY non-CONNECT ${first.slice(0, 120)}`); s.write("HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n"); s.end(); return; }
        const [, host, port] = m;
        if (!allow.includes(host.toLowerCase()) || port !== "443") { log(`DENY ${host}:${port}`); s.write("HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n"); s.end(); return; }
        log(`ALLOW ${host}:${port}`);
        const rest = st.buf.subarray(end + 4);
        st.connecting = true;
        try {
          const up = await Bun.connect({
            hostname: host, port: +port,
            socket: { data(_u, d) { pipe.write(s, d); }, drain(u) { pipe.drain(u); }, close() { pipe.end(s); }, error() { pipe.end(s); } },
          });
          st.up = up; st.connecting = false;
          s.write("HTTP/1.1 200 Connection Established\r\n\r\n");
          if (rest.length) pipe.write(up, rest);
          for (const p of st.pending) pipe.write(up, p);
          st.pending = [];
        } catch (e) {
          log(`FAIL ${host}:${port} ${String(e).slice(0, 100)}`);
          s.write("HTTP/1.1 502 Bad Gateway\r\nContent-Length: 0\r\n\r\n"); s.end();
        }
      },
      close(s) { if (s.data?.up) pipe.end(s.data.up); },
      error(s) { if (s.data?.up) pipe.end(s.data.up); },
    },
  });
  return { socketDir, socketPath, stop: () => server.stop(true) };
}

/** Runs inside the sandbox: 127.0.0.1:PORT -> the mounted proxy socket. */
export const FORWARDER = `${PIPE_SRC}
const pipe = makePipe();
const [sock, port] = [process.argv[2], +process.argv[3]];
Bun.listen({ hostname: "127.0.0.1", port, socket: {
  open(c) {
    c.data = { q: [] };
    Bun.connect({ unix: sock, socket: { data(_u, d) { pipe.write(c, d); }, drain(u) { pipe.drain(u); }, close() { pipe.end(c); }, error() { pipe.end(c); } } })
      .then((up) => { c.data.up = up; for (const x of c.data.q) pipe.write(up, x); c.data.q = []; }, () => c.end());
  },
  data(c, d) { if (c.data.up) pipe.write(c.data.up, d); else c.data.q.push(new Uint8Array(d)); },
  drain(c) { pipe.drain(c); },
  close(c) { if (c.data?.up) pipe.end(c.data.up); }, error(c) { if (c.data?.up) pipe.end(c.data.up); },
} });
`;
