#!/usr/bin/env bun
// Launches one sync node per source on local ports.
//
//   bun packages/sync/src/cli.ts                       # sources/*/examples on ports 8101–8104
//   bun packages/sync/src/cli.ts --items 'corpus/{source}' --base-port 9101
//
// Flags:
//   --items <pattern>    item directory per source; `{source}` is replaced by the source name
//                        (default 'sources/{source}/examples')
//   --sources a,b,c      which sources (default riverside,northgate,lakeview,homelog)
//   --base-port <n>      first port; sources get consecutive ports in the order given (default 8101)
//   --host <h>           bind address (default 127.0.0.1)
//
// Keys and schemas always come from sources/<source>/keys and sources/<source>/schema.
// On start it prints the host map a client needs (DID host → local base URL).

import { join, resolve } from "node:path";
import { DEFAULT_SOURCES, startNode } from "./index.ts";
import { parseArgs } from "node:util";

const ROOT = resolve(import.meta.dir, "../../..");
const { values } = parseArgs({
  options: {
    items: { type: "string", default: "sources/{source}/examples" },
    sources: { type: "string", default: DEFAULT_SOURCES.join(",") },
    "base-port": { type: "string", default: "8101" },
    host: { type: "string", default: "127.0.0.1" },
  },
});

const sources = values.sources!.split(",").map((s) => s.trim()).filter(Boolean);
const base = Number(values["base-port"]);
const hostMap: Record<string, string> = {};
for (const [i, source] of sources.entries()) {
  const itemsDir = resolve(ROOT, values.items!.replaceAll("{source}", source));
  const running = await startNode(
    {
      source,
      itemsDir,
      keysDir: join(ROOT, "sources", source, "keys"),
      schemaDir: join(ROOT, "sources", source, "schema"),
      log: (m) => console.error(m),
    },
    base + i,
    values.host,
  );
  hostMap[running.host] = running.url;
  console.error(`${source.padEnd(10)} ${running.node.issuer.padEnd(36)} ${running.url}  (${running.node.size} items from ${itemsDir})`);
}
console.log(JSON.stringify({ hostMap }, null, 2));
