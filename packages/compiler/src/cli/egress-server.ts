// Child process: serves one run's egress proxy (egress.ts). Args: <runDir> <host,host,...> <socketDir>
// Exits when the run is finished (agent-runner writes <runDir>/meta.json) or after 2 hours.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { startEgressProxyAt } from "../egress.ts";
const [runDir, hosts, socketDir] = process.argv.slice(2);
const e = startEgressProxyAt(runDir, hosts.split(","), socketDir);
const t0 = Date.now();
setInterval(() => { if (existsSync(join(runDir, "meta.json")) || Date.now() - t0 > 2 * 3600_000) { e.stop(); process.exit(0); } }, 2000);
