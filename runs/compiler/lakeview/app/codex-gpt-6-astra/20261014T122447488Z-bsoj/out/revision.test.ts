import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const genericHistory = "Personal history of other endocrine, nutritional and metabolic disease";
const condition = "Euglycemic diabetic ketoacidosis";
const asOf = "2026-10-13";

// Exercise the actual supplied feedback items, not reconstructions of their rows.
const feedback = await Bun.file(new URL("../in/feedback.md", import.meta.url)).text();
const cases = [...feedback.matchAll(/````markdown\n([\s\S]*?)\n````/g)].map(match => {
  const markdown = match[1];
  const header = /^---\n([\s\S]*?)\n---\n/.exec(markdown)!;
  const field = (name: string) => new RegExp(`^${name}: "([^"]+)"$`, "m").exec(header[1])![1];
  const payload = /```json payload\n([\s\S]*?)\n```/.exec(markdown)!;
  const item: FolioItem = {
    folio: field("folio"), id: field("id"), issuer: field("issuer"), patient: field("patient"),
    recorded: field("recorded"), effective: field("effective"),
    narrative: markdown.slice(header[0].length, payload.index).trim(), payload: JSON.parse(payload[1]),
  };
  return item;
});

function history(ref = "earlier euglycemic DKA", entryId = "history"): FolioItem {
  const fixture = structuredClone(cases[0]);
  fixture.payload = { visit: fixture.payload.visit, [entryId]: fixture.payload.dx_dka_hx };
  fixture.narrative = `<ref id="${entryId}">${ref}</ref>`;
  return fixture;
}

function acute(): FolioItem {
  const fixture = history();
  fixture.id = "acute";
  fixture.recorded = fixture.effective = "2023-02-01T13:00:00-06:00";
  fixture.payload.visit.VISIT_AT = fixture.effective;
  fixture.payload.history = {
    ...fixture.payload.history, ICD10CM: "E11.10", DX_TEXT: "Type 2 diabetes mellitus with ketoacidosis without coma", DX_STATUS: "A",
  };
  fixture.narrative = '<ref id="history">Euglycemic DKA since 2023-01</ref>';
  return fixture;
}

describe("reported history-label discrepancies", () => {
  test("all three feedback items name the resolved illness and preserve the source code", () => {
    expect(cases).toHaveLength(3);
    for (const item of cases) {
      const output = transform([item], item.recorded.slice(0, 10));
      expect(output.problems).toHaveLength(4);
      expect(output.problems.find(row => row.icd10cm === "Z86.39")).toEqual({
        condition, icd10cm: "Z86.39", status: "resolved", evidence: [{ item_id: item.id, entry_id: "dx_dka_hx" }],
      });
      expect(output.allergies).toEqual([]);
      expect(output.labs).toEqual([]);
    }
  });

  test("repeated history entries use the latest in-scope diagnosis and its evidence", () => {
    for (const latest of cases) {
      const row = transform(cases.toReversed(), latest.recorded.slice(0, 10)).problems.find(row => row.icd10cm === "Z86.39");
      expect(row).toEqual({ condition, icd10cm: "Z86.39", status: "resolved", evidence: [{ item_id: latest.id, entry_id: "dx_dka_hx" }] });
    }
  });

  test("history resolves an earlier acute diagnosis without resolving diabetes or an adverse effect", () => {
    const first = acute();
    first.payload.dm = { ...first.payload.history, ICD10CM: "E11.22", DX_TEXT: "Type 2 diabetes mellitus with diabetic chronic kidney disease" };
    first.payload.adr = { ...first.payload.history, ICD10CM: "T38.3X5A", DX_TEXT: "Adverse effect of empagliflozin, initial encounter" };
    const output = transform([cases[0], first], asOf);
    expect(output.problems.filter(row => /ketoacidosis/i.test(row.condition))).toHaveLength(1);
    expect(output.problems.find(row => /ketoacidosis/i.test(row.condition))).toEqual({
      condition, icd10cm: "Z86.39", status: "resolved", onset: { value: "2023-01", precision: "month" },
      evidence: [{ item_id: cases[0].id, entry_id: "dx_dka_hx" }, { item_id: "acute", entry_id: "history" }],
    });
    expect(output.problems.find(row => row.icd10cm === "E11.22")?.status).toBe("active");
    expect(output.allergies).toMatchObject([{ substance: "empagliflozin", type: "adverse_reaction" }]);
    expect(transform([cases[0], first], "2023-02-01").problems.find(row => row.icd10cm === "E11.10")?.status).toBe("active");
  });
});

describe("structured history and exact ref boundaries", () => {
  test("neither a particular code nor an entry-id spelling is assumed", () => {
    const item = history("earlier lactic acidosis", "arbitrary_entry_407");
    item.payload.arbitrary_entry_407.ICD10CM = "Z-test";
    item.narrative = "<ref title='history' id = 'arbitrary_entry_407'><em>earlier lactic acidosis</em></ref>";
    expect(transform([item], asOf).problems).toMatchObject([{ condition: "Lactic acidosis", icd10cm: "Z-test", status: "resolved" }]);
  });

  test("does not manufacture a condition from an entry id, an unrelated ref or unlinked prose", () => {
    for (const narrative of ["", "Prior euglycemic DKA", '<ref id="other">Prior euglycemic DKA</ref>']) {
      const item = history();
      item.narrative = narrative;
      expect(transform([item], asOf).problems[0].condition).toBe(genericHistory);
    }
    const item = history();
    delete item.payload.history;
    expect(transform([item], asOf).problems).toEqual([]);
  });

  test("provisional and ruled-out structured states are not made historical by prose", () => {
    for (const status of ["P", "R"]) {
      const item = history();
      item.payload.history.DX_STATUS = status;
      expect(transform([item], asOf).problems).toEqual([]);
    }
  });

  test("ambiguous or conflicting refs retain the source description", () => {
    for (const ref of ["No euglycemic DKA", "Possible euglycemic DKA", "Family history of euglycemic DKA", "History reviewed"]) {
      expect(transform([history(ref)], asOf).problems[0].condition).toBe(genericHistory);
    }
    const item = history();
    item.narrative += '<ref id="history">prior lactic acidosis</ref>';
    expect(transform([item], asOf).problems[0].condition).toBe(genericHistory);
  });

  test("a nonspecific history cannot resolve an earlier named illness", () => {
    const item = history();
    item.narrative = "History reviewed";
    const rows = transform([acute(), item], asOf).problems;
    expect(rows.find(row => row.icd10cm === "E11.10")?.status).toBe("active");
    expect(rows.find(row => row.icd10cm === "Z86.39")).toMatchObject({ condition: genericHistory, status: "resolved" });
  });

  test("later corrections and retractions remove the clarified history", () => {
    const old = history();
    const replacement = structuredClone(old);
    replacement.id = "correction";
    replacement.recorded = "2023-08-08T12:00:00-05:00";
    replacement.supersedes = [old.id];
    replacement.narrative = '<ref id="history">prior lactic acidosis</ref>';
    expect(transform([replacement, old], "2023-08-07").problems[0].condition).toBe(condition);
    expect(transform([old, replacement], asOf).problems[0].condition).toBe("Lactic acidosis");
    const retraction = { ...replacement, id: "retraction", recorded: "2023-08-09T12:00:00-05:00", payload: {}, retracts: [replacement.id] };
    expect(transform([old, replacement, retraction], asOf).problems).toEqual([]);
  });

  test("ordering and duplicate input copies do not change the revised rows", () => {
    const input = [acute(), ...cases];
    const shuffled = input.toReversed().map(item => ({ ...item, payload: Object.fromEntries(Object.entries(item.payload).reverse()) }));
    expect(transform([...shuffled, ...shuffled], asOf)).toEqual(transform(input, asOf));
  });
});
