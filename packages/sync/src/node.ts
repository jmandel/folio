// A FOLIO sync node for one source (spec/sync.md): serves a directory of items, signed with the
// source's issuer key, as an append-only per-patient feed, plus the schemas and the DID document.
//
// Log order. The node keeps one append-only log of signed items. At start it reads every item file
// in the directory and appends them sorted by (`recorded` instant, `id`); on each sync request it
// rescans and appends files it has not seen, so new files land at the end. A cursor is a log
// position, so a cursor stays valid as the log grows. This dev node keeps the log in memory and
// rebuilds it the same way on restart (same files → same order); a production node persists it.

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { didWebHost, sign, validateItem, type DidDocument, type IssuerKey, type Item } from "@folio/core";
import { listItemFiles, loadDidDocument, loadIssuerKey, readItemFile } from "@folio/core/node";

export interface NodeConfig {
  /** Short source name, for logs. */
  source: string;
  /** Directory of `.folio.md` / `.folio.json` files (searched recursively). */
  itemsDir: string;
  /** Directory with issuer-key.json and did.json. */
  keysDir: string;
  /** Directory of `.d.ts` schema files. */
  schemaDir: string;
  /** Default and maximum page sizes. */
  pageSize?: number;
  maxPageSize?: number;
  log?: (msg: string) => void;
}

interface LogEntry {
  seq: number; // 1-based position in the log
  patient: string;
  key: string; // item id
  sdJwt: string;
}

const CURSOR_PREFIX = "folio-sync-1:";
export function encodeCursor(seq: number): string {
  return Buffer.from(CURSOR_PREFIX + seq).toString("base64url");
}
export function decodeCursor(c: string): number | null {
  try {
    const s = Buffer.from(c, "base64url").toString("utf8");
    if (!s.startsWith(CURSOR_PREFIX)) return null;
    const n = Number(s.slice(CURSOR_PREFIX.length));
    return Number.isInteger(n) && n >= 0 ? n : null;
  } catch {
    return null;
  }
}

const instant = (t: string) => {
  const ms = Date.parse(t);
  return Number.isNaN(ms) ? 0 : ms;
};

export class SyncNode {
  readonly key: IssuerKey;
  readonly didDocument: DidDocument;
  private log: LogEntry[] = [];
  private seenFiles = new Set<string>();
  private seenIds = new Set<string>();
  private schemasByName = new Map<string, Buffer>();
  private schemasByHash = new Map<string, Buffer>();
  private refreshing: Promise<void> = Promise.resolve();
  private say: (m: string) => void;

  constructor(readonly config: NodeConfig) {
    this.key = loadIssuerKey(config.keysDir);
    this.didDocument = loadDidDocument(config.keysDir);
    if (this.didDocument.id !== this.key.did) throw new Error(`${config.source}: did.json id does not match issuer key`);
    this.say = config.log ?? (() => {});
    for (const f of existsSync(config.schemaDir) ? readdirSync(config.schemaDir) : []) {
      if (!f.endsWith(".d.ts")) continue;
      const bytes = readFileSync(join(config.schemaDir, f));
      this.schemasByName.set(f, bytes);
      this.schemasByHash.set(createHash("sha256").update(bytes).digest("hex"), bytes);
    }
  }

  get issuer(): string {
    return this.key.did;
  }

  get size(): number {
    return this.log.length;
  }

  /** Appends item files not yet in the log. Serialized: concurrent calls wait for each other. */
  refresh(): Promise<void> {
    this.refreshing = this.refreshing.then(() => this.doRefresh());
    return this.refreshing;
  }

  private async doRefresh(): Promise<void> {
    if (!existsSync(this.config.itemsDir)) return;
    const fresh: Item[] = [];
    for (const path of listItemFiles(this.config.itemsDir)) {
      if (this.seenFiles.has(path)) continue;
      this.seenFiles.add(path);
      let item: Item;
      try {
        item = readItemFile(path);
      } catch (e) {
        this.say(`${this.config.source}: skipping ${path}: ${(e as Error).message}`);
        continue;
      }
      if (item.issuer !== this.issuer) {
        this.say(`${this.config.source}: skipping ${path}: issuer ${item.issuer} is not ${this.issuer}`);
        continue;
      }
      const issues = validateItem(item);
      if (issues.length) {
        this.say(`${this.config.source}: skipping invalid ${path}: ${issues.map((i) => i.path + " " + i.message).join("; ")}`);
        continue;
      }
      if (this.seenIds.has(item.id)) {
        this.say(`${this.config.source}: skipping ${path}: item ${item.id} already published (items are immutable)`);
        continue;
      }
      this.seenIds.add(item.id);
      fresh.push(item);
    }
    fresh.sort((a, b) => instant(a.recorded) - instant(b.recorded) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    for (const item of fresh) {
      const sdJwt = await sign(item, this.key);
      this.log.push({ seq: this.log.length + 1, patient: item.patient, key: item.id, sdJwt });
    }
    if (fresh.length) this.say(`${this.config.source}: log now ${this.log.length} item(s)`);
  }

  /** Handles one HTTP request. */
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (req.method !== "GET" && req.method !== "HEAD") return json({ error: "method not allowed" }, 405);
    const path = url.pathname;

    if (path === "/.well-known/did.json") return json(this.didDocument, 200, { "content-type": "application/did+json" });

    const sync = path.match(/^\/patients\/([^/]+)\/sync$/);
    if (sync) return this.handleSync(decodeURIComponent(sync[1]), url);

    const byHash = path.match(/^\/folio\/schemas\/sha256\/([0-9a-f]{64})$/);
    if (byHash) return this.schema(this.schemasByHash.get(byHash[1]), byHash[1]);
    const byName = path.match(/^\/folio\/schemas\/([^/]+\.d\.ts)$/);
    if (byName) {
      const bytes = this.schemasByName.get(byName[1]);
      return this.schema(bytes, bytes && createHash("sha256").update(bytes).digest("hex"));
    }
    if (path === "/") return json({ issuer: this.issuer, sync: "/patients/{patient}/sync?since={cursor}", did: "/.well-known/did.json" });
    return json({ error: "not found" }, 404);
  }

  private schema(bytes: Buffer | undefined, sha?: string): Response {
    if (!bytes) return json({ error: "no such schema" }, 404);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        etag: `"sha256-${sha}"`,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  }

  private async handleSync(patient: string, url: URL): Promise<Response> {
    const since = url.searchParams.get("since");
    let from = 0;
    if (since !== null && since !== "") {
      const n = decodeCursor(since);
      if (n === null) return json({ error: "invalid cursor" }, 400);
      from = n;
    }
    const max = this.config.maxPageSize ?? 500;
    const limitParam = url.searchParams.get("limit");
    let limit = this.config.pageSize ?? 100;
    if (limitParam !== null) {
      const n = Number(limitParam);
      if (!Number.isInteger(n) || n < 1) return json({ error: "limit must be a positive integer" }, 400);
      limit = Math.min(n, max);
    }
    await this.refresh();
    if (from > this.log.length) return json({ error: "cursor is beyond the end of this log; resync from the start" }, 410);

    const items: string[] = [];
    let pos = from; // log entries [0, pos) have been examined
    while (pos < this.log.length && items.length < limit) {
      const e = this.log[pos++];
      if (e.patient === patient) items.push(e.sdJwt);
    }
    // More only if a later entry is for this patient; otherwise skip ahead to the end of the log.
    let more = false;
    for (let k = pos; k < this.log.length; k++) if (this.log[k].patient === patient) { more = true; break; }
    if (!more) pos = this.log.length;
    return json({ issuer: this.issuer, patient, items, next: encodeCursor(pos), more });
  }
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });
}

export interface RunningNode {
  node: SyncNode;
  url: string;
  host: string; // the DID's host, e.g. "lakeview-labs.example"
  stop(): void;
}

/** Starts a node on a port (0 = any free port). Signs the directory before returning. */
export async function startNode(config: NodeConfig, port: number, hostname = "127.0.0.1"): Promise<RunningNode> {
  const node = new SyncNode(config);
  await node.refresh();
  const server = Bun.serve({ port, hostname, fetch: (req) => node.fetch(req) });
  return {
    node,
    url: `http://${hostname}:${server.port}`,
    host: didWebHost(node.issuer),
    stop: () => server.stop(true),
  };
}

/** The fixed local ports used by the dev launcher (A, B, C, then the patient app). */
export const DEFAULT_SOURCES = ["riverside", "northgate", "lakeview", "homelog"] as const;
