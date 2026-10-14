import { transform } from "./transform";
import { transform as previous } from "../in/previous/transform";
import type { FolioItem } from "../in/views/views";
import samples from "../in/samples/samples.json";

const feedback = await Bun.file(new URL("../in/feedback.md", import.meta.url)).text();
const items: FolioItem[] = [...feedback.matchAll(/````markdown\n([\s\S]*?)\n````/g)].map(([, block]) => {
  const field = (name: string) => new RegExp(`^${name}: "([^"]+)"`, "m").exec(block)?.[1] ?? "";
  const payload = JSON.parse(/```json payload\n([\s\S]*?)\n```/.exec(block)![1]);
  const replaces = /^supersedes:\n((?:  - [^\n]+\n)+)/m.exec(block)?.[1] ?? "";
  return {
    folio: field("folio"), id: field("id"), issuer: field("issuer"), patient: field("patient"),
    effective: field("effective"), recorded: field("recorded"), narrative: "", payload,
    supersedes: [...replaces.matchAll(/  - "([^"]+)"/g)].map(m => m[1]),
  };
});
if (items.length !== 2) throw new Error("Expected both feedback snapshots");
for (const asOf of ["2025-10-01", "2026-05-09"]) {
  const rows = transform([...items].reverse(), asOf);
  const ibuprofen = rows.medications.find(row => row.ingredient === "ibuprofen");
  if (ibuprofen?.dose?.value !== 400 || ibuprofen.dose.unit !== "mg") throw new Error(`Wrong dose at ${asOf}`);
  const expectedItem = items.find(i => i.effective === asOf)!;
  if (ibuprofen.evidence[0].item_id !== expectedItem.id) throw new Error(`Wrong evidence at ${asOf}`);
  const oldRows = previous(items, asOf);
  oldRows.medications.find(row => row.ingredient === "ibuprofen")!.dose = { value: 400, unit: "mg" };
  // Property insertion order can differ; compare the objects structurally.
  const stable = (value: unknown): string => JSON.stringify(value, (_key, val) =>
    val && typeof val === "object" && !Array.isArray(val)
      ? Object.fromEntries(Object.keys(val).sort().map(key => [key, val[key]])) : val);
  if (stable(rows) !== stable(oldRows)) throw new Error(`Unexpected changes at ${asOf}`);
}
for (const sample of samples) {
  if (JSON.stringify(transform(sample.items, "2026-10-13")) !== JSON.stringify(previous(sample.items, "2026-10-13"))) {
    throw new Error(`Unexpected sample change for ${sample.patient}`);
  }
}
console.log("Both full feedback snapshots yield 400 mg with correct evidence; all other feedback and sample rows are unchanged.");
