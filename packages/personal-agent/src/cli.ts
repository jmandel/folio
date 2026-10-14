#!/usr/bin/env bun
// Personal Agent CLI.
//
//   bun packages/personal-agent/src/cli.ts sync      [--config <file>] [--store <dir>]
//   bun packages/personal-agent/src/cli.ts timeline  [--store <dir>] [--history]
//   bun packages/personal-agent/src/cli.ts units     --item <id> [--store <dir>]
//   bun packages/personal-agent/src/cli.ts present   --item <id> [--withhold a,b] [--disclose a,b]
//                                                    [--withhold-matching <regex>] [--out <file>]
//   bun packages/personal-agent/src/cli.ts verify    <presentation-file> [--config <file>] [--offline]
//
// Defaults: --config packages/personal-agent/hero.config.json, --store .folio-agent/hero

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { listUnits } from "@folio/core";
import {
  findItem, makePresentation, readSigned, renderVerified, syncAll, timeline, verifyPresentation, type AgentConfig,
} from "./index.ts";

const ROOT = resolve(import.meta.dir, "../../..");
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    config: { type: "string", default: resolve(ROOT, "packages/personal-agent/hero.config.json") },
    store: { type: "string", default: resolve(ROOT, ".folio-agent/hero") },
    history: { type: "boolean", default: false },
    item: { type: "string" },
    withhold: { type: "string" },
    disclose: { type: "string" },
    "withhold-matching": { type: "string" },
    out: { type: "string" },
    offline: { type: "boolean", default: false },
    limit: { type: "string" },
  },
});
const [cmd, ...args] = positionals;
const list = (s?: string) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean) : undefined);
const config = (): AgentConfig => JSON.parse(readFileSync(values.config!, "utf8"));
const store = values.store!;

switch (cmd) {
  case "sync": {
    const reports = await syncAll(config(), store, { log: (m) => console.log(m), limit: values.limit ? Number(values.limit) : undefined });
    const bad = reports.reduce((n, r) => n + r.rejected.length + r.schemaProblems.length, 0);
    console.log(`store: ${store}`);
    process.exit(bad ? 1 : 0);
  }
  case "timeline":
    for (const l of timeline(store, { history: values.history })) console.log(l);
    break;
  case "units": {
    const row = findItem(store, need(values.item, "--item"));
    for (const u of await listUnits(readSigned(store, row))) {
      const what = u.hasEntry ? `entry ${String((u.entry as any)?.type ?? "")}` : "narrative-only";
      const span = u.spanTexts.length ? `  "${u.spanTexts.join(" … ").replace(/\s+/g, " ").slice(0, 70)}"` : "";
      console.log(`${u.id.padEnd(22)} ${what.padEnd(24)} slots [${u.slots.join(",")}]${span}`);
    }
    break;
  }
  case "present": {
    const row = findItem(store, need(values.item, "--item"));
    const { presentation, withheld } = await makePresentation(readSigned(store, row), {
      withhold: list(values.withhold),
      disclose: list(values.disclose),
      withholdMatching: values["withhold-matching"],
    });
    // Show the presenter exactly what the receiver will see before anything is shared.
    const v = await verifyPresentation(presentation, { store, offline: true });
    console.error(`Withholding: ${withheld.length ? withheld.join(", ") : "(nothing)"}`);
    console.error(
      "Check before sharing: the receiver sees the text below, with each withheld part marked.\n" +
        "Withholding can change what the rest means (a reader may assume a different cause or a\n" +
        "complete list). Prose outside the marked spans is always shared.\n",
    );
    console.error(renderVerified(v));
    console.error("");
    if (values.out) {
      writeFileSync(values.out, presentation + "\n");
      console.error(`presentation written to ${values.out}`);
    } else console.log(presentation);
    break;
  }
  case "verify": {
    const file = need(args[0], "<presentation-file>");
    const v = await verifyPresentation(readFileSync(file, "utf8"), { hostMap: config().hostMap, store, offline: values.offline });
    console.log(`VERIFIED: signed by ${v.kid}`);
    console.log(renderVerified(v));
    break;
  }
  default:
    console.error("usage: folio-agent sync|timeline|units|present|verify (see header of src/cli.ts)");
    process.exit(2);
}

function need<T>(v: T | undefined, what: string): T {
  if (v === undefined) {
    console.error(`missing ${what}`);
    process.exit(2);
  }
  return v;
}
