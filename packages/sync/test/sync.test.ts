import { afterAll, beforeAll, expect, test } from "bun:test";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createDidWebResolver, parseMarkdown, toMarkdown, verify, type Item } from "@folio/core";
import { decodeCursor, encodeCursor, pullPages, startNode, type RunningNode } from "../src/index.ts";

const ROOT = resolve(import.meta.dir, "../../..");
const LV = join(ROOT, "sources", "lakeview");
const PATIENT = "LV-0072914";
let dir: string;
let running: RunningNode;

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "folio-sync-test-"));
  cpSync(join(LV, "examples"), dir, { recursive: true });
  // A second patient interleaved in the same log.
  const other = parseMarkdown(readFileSync(join(LV, "examples", "2026-02-09-renal-panel-a1c.folio.md"), "utf8"));
  for (const [i, rec] of ["2021-06-01T10:00:00-05:00", "2024-06-01T10:00:00-05:00"].entries())
    writeFileSync(join(dir, `other-${i}.folio.md`), toMarkdown({ ...other, id: `01HZZZZZZZZZZZZZZZZZZZZZZ${i}`, patient: "LV-9999999", recorded: rec } as Item));
  running = await startNode({ source: "lakeview", itemsDir: dir, keysDir: join(LV, "keys"), schemaDir: join(LV, "schema") }, 0);
});
afterAll(() => running?.stop());

const get = (path: string) => fetch(running.url + path);

test("did.json and schemas by URL and by hash", async () => {
  const did = await (await get("/.well-known/did.json")).json();
  expect(did.id).toBe("did:web:lakeview-labs.example");
  const bytes = new Uint8Array(await (await get("/folio/schemas/lakeview-v1.d.ts")).arrayBuffer());
  const sha = createHash("sha256").update(bytes).digest("hex");
  const item = parseMarkdown(readFileSync(join(LV, "examples", "2026-02-09-renal-panel-a1c.folio.md"), "utf8"));
  expect(sha).toBe(item.schema!.sha256);
  const byHash = new Uint8Array(await (await get(`/folio/schemas/sha256/${sha}`)).arrayBuffer());
  expect(byHash).toEqual(bytes);
  expect((await get(`/folio/schemas/sha256/${"0".repeat(64)}`)).status).toBe(404);
});

test("paging: limit 2 walks all nine Lakeview items in log order, other patient excluded", async () => {
  const pages = [];
  for await (const p of pullPages({ baseUrl: running.url, patient: PATIENT, limit: 2 })) pages.push(p);
  expect(pages.map((p) => p.items.length)).toEqual([2, 2, 2, 2, 1]);
  expect(pages.slice(0, -1).every((p) => p.more)).toBe(true);
  expect(pages.at(-1)!.more).toBe(false);
  const resolver = createDidWebResolver({ documents: { [running.node.issuer]: running.node.didDocument } });
  const verified = await Promise.all(pages.flatMap((p) => p.items).map((s) => verify(s, resolver)));
  expect(verified.every((v) => v.envelope.patient === PATIENT && v.complete)).toBe(true);
  const recorded = verified.map((v) => Date.parse(v.envelope.recorded));
  expect([...recorded].sort((a, b) => a - b)).toEqual(recorded);
  // The final cursor is the end of the whole log (11 entries, including the other patient's).
  expect(decodeCursor(pages.at(-1)!.next)).toBe(11);
});

test("cursor: nothing new → empty page; an appended file arrives alone and at the end", async () => {
  const first = await (await get(`/patients/${PATIENT}/sync`)).json();
  expect(first.items.length).toBe(9);
  const again = await (await get(`/patients/${PATIENT}/sync?since=${first.next}`)).json();
  expect(again).toMatchObject({ items: [], more: false, next: first.next });

  // Publish a new item whose `recorded` is *earlier* than others: it is still appended at the end.
  const src = parseMarkdown(readFileSync(join(LV, "examples", "2025-08-18-a1c-cbc.folio.md"), "utf8"));
  writeFileSync(join(dir, "late.folio.md"), toMarkdown({ ...src, id: "01K2Z4NK9GHMNPJ1T8H34HX6RF", recorded: "2020-01-01T00:00:00Z" } as Item));
  const delta = await (await get(`/patients/${PATIENT}/sync?since=${first.next}`)).json();
  expect(delta.items.length).toBe(1);
  expect(decodeCursor(delta.next)).toBe(12);
  // Earlier cursors still work and see the appended item last.
  const fromStart = await (await get(`/patients/${PATIENT}/sync`)).json();
  expect(fromStart.items.length).toBe(10);
  expect(fromStart.items.at(-1)).toBe(delta.items[0]);
});

test("bad cursors and limits", async () => {
  expect((await get(`/patients/${PATIENT}/sync?since=garbage`)).status).toBe(400);
  expect((await get(`/patients/${PATIENT}/sync?since=${encodeCursor(999)}`)).status).toBe(410);
  expect((await get(`/patients/${PATIENT}/sync?limit=0`)).status).toBe(400);
  const unknown = await (await get(`/patients/NOPE/sync`)).json();
  expect(unknown.items).toEqual([]);
});

test("client restarts from the beginning on 410", async () => {
  const pages = [];
  for await (const p of pullPages({ baseUrl: running.url, patient: PATIENT, since: encodeCursor(999) })) pages.push(p);
  expect(pages.flatMap((p) => p.items).length).toBe(10);
});
