import { expect, test } from "bun:test";
import { defaultView, itemKey, parseMarkdown, type Item } from "../src/index.ts";
import { fixtures } from "./fixtures.ts";

const items = fixtures().map((f) => parseMarkdown(f.text));
const byFile = (file: string) => parseMarkdown(fixtures().find((f) => f.file === file)!.text);
const LV = "did:web:lakeview-labs.example";
const NG = "did:web:northgate-fm.example";
const HL = "did:web:homelog.example";

/** A stand-in for an original the examples only point at (it arrives late). */
function original(from: Item, id: string, recorded: string): Item {
  return { ...structuredClone(from), id, recorded, supersedes: undefined, retracts: undefined } as Item;
}

test("fixtures alone: HomeLog BP-typo page hidden; unseen originals remembered", () => {
  const v = defaultView(items);
  expect(v.current.length).toBe(30);
  expect(v.superseded.get(`${HL} 01K32Y3SP83XC8N4W8T61981JQ`)).toEqual([`${HL} 01K354MY6RER4J9VD6EYDPZ5KA`]);
  expect(v.replacedButUnseen.sort()).toEqual([
    `${HL} 01KMTFFYM012DNBYBDSS7S2EVN`,
    `${LV} 01GCS992FRPWC6MKC8C79DYZY4`,
    `${NG} 01GCS9AFD894DK0R4CSZ74JM78`,
    `${NG} 01K95NT4FGX9G8FGVSQE8Z5379`,
  ].sort());
  expect(v.conflicts).toEqual([]);
});

test("K correction (T3): late-arriving K 6.1 originals are hidden at Lakeview and Northgate", () => {
  const lvCorrected = byFile("2022-09-12-potassium-corrected.folio.md");
  const ngInvalidated = byFile("2022-09-12-potassium-invalidated.folio.md");
  const lvOrig = original(lvCorrected, "01GCS992FRPWC6MKC8C79DYZY4", "2022-09-12T11:00:00-05:00");
  const ngOrig = original(ngInvalidated, "01GCS9AFD894DK0R4CSZ74JM78", "2022-09-12T11:05:00-05:00");
  const v = defaultView([...items, lvOrig, ngOrig]); // originals arrive after their replacements
  const cur = new Set(v.current.map(itemKey));
  expect(cur.has(itemKey(lvOrig))).toBe(false);
  expect(cur.has(itemKey(ngOrig))).toBe(false);
  expect(cur.has(itemKey(lvCorrected))).toBe(true);
  expect(cur.has(itemKey(ngInvalidated))).toBe(true);
  // The redraw (K 4.6) is its own current item, not a replacement.
  expect(cur.has(itemKey(byFile("2022-09-12-potassium-redraw.folio.md")))).toBe(true);
  expect(v.superseded.get(itemKey(lvOrig))).toEqual([itemKey(lvCorrected)]);
  expect(v.retracted.size).toBe(1);
});

test("atorvastatin 80 void (T4): retracted, void item itself stays current", () => {
  const voidItem = byFile("2025-11-04-atorvastatin-80-voided.folio.md");
  const orig = original(byFile("2026-02-11-metformin-dose-reduced.folio.md"), "01K95NT4FGX9G8FGVSQE8Z5379", "2025-11-03T15:12:00-06:00");
  const v = defaultView([orig, ...items]);
  expect(v.current.map(itemKey)).not.toContain(itemKey(orig));
  expect(v.current.map(itemKey)).toContain(itemKey(voidItem));
  expect(v.retracted.get(itemKey(orig))).toEqual([itemKey(voidItem)]);
  expect(v.superseded.has(itemKey(orig))).toBe(false);
});

test("ids are issuer-local: another issuer cannot hide an item", () => {
  const lvItem = byFile("2026-02-09-renal-panel-a1c.folio.md");
  const hostile = { ...byFile("2023-04-11-first-readings.folio.md"), id: "01KZZZZZZZZZZZZZZZZZZZZZZZ", supersedes: [lvItem.id], retracts: [lvItem.id] };
  const v = defaultView([lvItem, hostile]);
  expect(v.current.length).toBe(2);
});

test("transitive supersession and conflicts", () => {
  const a = byFile("2026-02-09-renal-panel-a1c.folio.md");
  const b = { ...a, id: "01KH25JH7RESV96C4ES94XQ7B0", supersedes: [a.id] };
  const c = { ...a, id: "01KH25JH7RESV96C4ES94XQ7B1", supersedes: [b.id] };
  expect(defaultView([c, b, a]).current.map((x) => x.id)).toEqual([c.id]);
  const d = { ...a, id: "01KH25JH7RESV96C4ES94XQ7B2", supersedes: [a.id] };
  const v = defaultView([a, b, d]);
  expect(v.current.map((x) => x.id).sort()).toEqual([b.id, d.id].sort());
  expect(v.conflicts).toEqual([{ item: itemKey(a), by: [itemKey(b), itemKey(d)] }]);
});
