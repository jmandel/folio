// End to end: four local sync nodes serve sources/*/examples; the Personal Agent syncs the hero
// from all four, verifies every item against did:web keys fetched from the nodes, stores a local
// log, prints a merged timeline, and makes and verifies a sertraline-withheld presentation.

import { afterAll, beforeAll, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { WITHHELD_MARKER, narrativeWithMarkers } from "@folio/core";
import { DEFAULT_SOURCES, startNode, type RunningNode } from "@folio/sync";
import { findItem, loadIndex, makePresentation, readSigned, renderVerified, syncAll, timeline, verifyPresentation, type AgentConfig } from "../src/index.ts";

const ROOT = resolve(import.meta.dir, "../../..");
const hero = JSON.parse(readFileSync(join(ROOT, "packages/personal-agent/hero.config.json"), "utf8")) as AgentConfig;
const nodes: RunningNode[] = [];
let config: AgentConfig;
let store: string;

beforeAll(async () => {
  for (const source of DEFAULT_SOURCES)
    nodes.push(await startNode({
      source,
      itemsDir: join(ROOT, "sources", source, "examples"),
      keysDir: join(ROOT, "sources", source, "keys"),
      schemaDir: join(ROOT, "sources", source, "schema"),
    }, 0));
  config = { ...hero, hostMap: Object.fromEntries(nodes.map((n) => [n.host, n.url])) };
  store = mkdtempSync(join(tmpdir(), "folio-agent-test-"));
});
afterAll(() => nodes.forEach((n) => n.stop()));

test("syncs all 31 hero items from four nodes, verified, with schemas checked", async () => {
  const reports = await syncAll(config, store, { limit: 3 }); // small pages to exercise paging
  expect(reports.map((r) => [r.source, r.added])).toEqual([["riverside", 4], ["northgate", 12], ["lakeview", 9], ["homelog", 6]]);
  expect(reports.every((r) => r.rejected.length === 0 && r.schemaProblems.length === 0)).toBe(true);
  const index = loadIndex(store);
  expect(index.items.length).toBe(31);
  expect(readdirSync(join(store, "schemas")).length).toBe(4);
  expect(readdirSync(join(store, "dids")).length).toBe(4);
  for (const r of index.items) {
    expect(existsSync(join(store, r.file))).toBe(true);
    expect(existsSync(join(store, r.file.replace(/\.sd-jwt$/, ".folio.md")))).toBe(true);
  }
});

test("second sync is incremental", async () => {
  const reports = await syncAll(config, store);
  expect(reports.every((r) => r.received === 0)).toBe(true);
});

test("merged timeline: default view, clinical-time order, all four sources", () => {
  const lines = timeline(store);
  const body = lines.slice(0, -1);
  expect(body.length).toBe(30); // the HomeLog BP-typo day page is superseded
  expect(lines.at(-1)).toContain("30 item(s) in the default view from 4 source(s); 1 superseded");
  expect(body.join("\n")).not.toContain("01K32Y3SP83XC8N4W8T61981JQ");
  for (const s of DEFAULT_SOURCES) expect(body.some((l) => l.includes(` ${s} `))).toBe(true);
  expect(body[0]).toContain("2019-03-18");
  expect(body.at(-1)).toContain("2026-09-14T16:20");
  const hist = timeline(store, { history: true });
  expect(hist.find((l) => l.includes("01K32Y3SP83XC8N4W8T61981JQ"))).toContain("[SUPERSEDED]");
});

test("tampered item from a node is rejected", async () => {
  const evil = { ...config, sources: [config.sources[2]] };
  const realFetch = (u: string) => fetch(u);
  const tamperingFetch = async (u: string) => {
    const res = await realFetch(u);
    if (!u.includes("/sync")) return res;
    const page = await res.json();
    page.items = page.items.map((s: string) => s.replace(/~([^~]+)~/, (_m, d) => `~${d.slice(0, -2)}AA~`));
    return new Response(JSON.stringify(page), { headers: { "content-type": "application/json" } });
  };
  const fresh = mkdtempSync(join(tmpdir(), "folio-agent-evil-"));
  const [rep] = await syncAll(evil, fresh, { fetch: tamperingFetch });
  expect(rep.added).toBe(0);
  expect(rep.rejected.length).toBe(9);
});

test("present the Lakeview nephrology note and HomeLog med list without sertraline; verify", async () => {
  for (const [id, expectSlot] of [["01KXEQKXQGGFWM3XCNV7YSNJGV", true], ["01KQN2FD70GFSXF3DM02V7HGMX", false]] as const) {
    const signed = readSigned(store, findItem(store, id));
    const { presentation, withheld } = await makePresentation(signed, { withholdMatching: "sertraline" });
    expect(withheld.length).toBe(1);
    const v = await verifyPresentation(presentation, { hostMap: config.hostMap });
    expect(v.complete).toBe(false);
    expect(JSON.stringify(v)).not.toMatch(/sertraline/i);
    expect(renderVerified(v)).toMatch(/^PARTIAL ITEM/);
    if (expectSlot) expect(narrativeWithMarkers(v)).toContain(WITHHELD_MARKER);
    // Also verifiable offline from the DID documents cached in the store.
    expect((await verifyPresentation(presentation, { store, offline: true })).envelope.id).toBe(id);
  }
});
