import { describe, expect, test } from "bun:test";
import {
  CATEGORIES,
  RECORDED_START,
  absentText,
  describeShare,
  topicState,
  PRESETS,
  RECORDED,
  classify,
  decide,
  icdMatches,
  parseReply,
  presetOf,
  presetPolicy,
  suggestions,
  systemPrompt,
  viewRowSource,
  ruleSource,
  type Decision,
} from "../src/index.ts";
import { allHeroParts, referralParts } from "./hero.ts";

const HP = "riverside/2024-11-02-admission-hp.folio.md";
const DC = "riverside/2024-11-05-discharge-summary.folio.md";
const HL = "homelog/2026-05-02-my-medicines.folio.md";
const LV = "lakeview/2026-07-13-new-visit.folio.md";

const withheld = (ds: Decision[]) => ds.filter((d) => !d.share).map((d) => d.key).sort();

describe("referral items", () => {
  const parts = referralParts();

  test("the five items carry 67 parts", () => {
    expect(parts.length).toBe(67);
  });

  test("share everything withholds nothing", () => {
    expect(withheld(decide(parts, presetPolicy("everything")))).toEqual([]);
  });

  test("keeping sensitive topics private withholds exactly the depression and sertraline parts", () => {
    expect(withheld(decide(parts, presetPolicy("private")))).toEqual(
      [`${DC}#med_sertraline`, `${HL}#med_5`, `${LV}#na_sertraline`, `${HP}#hx_mdd`, `${HP}#med_sertraline`].sort(),
    );
  });

  test("every withheld part is mental health, and says why", () => {
    for (const d of decide(parts, presetPolicy("private")).filter((d) => !d.share)) {
      expect(d.categories).toEqual(["mental_health"]);
      expect(d.reason).toContain("mental health");
      expect(d.hits.length).toBeGreaterThan(0);
    }
  });

  test("the diagnosis is a condition; the medicine entries and the clinic's sertraline sentence are medicine-only", () => {
    const ds = new Map(decide(parts, presetPolicy("private")).map((d) => [d.key, d]));
    expect(ds.get(`${HP}#hx_mdd`)!.medicineOnly).toBe(false);
    for (const k of [`${HP}#med_sertraline`, `${DC}#med_sertraline`, `${HL}#med_5`, `${LV}#na_sertraline`]) expect(ds.get(k)!.medicineOnly).toBe(true);
    // HomeLog's entry has an SCD code (312938), not the ingredient; the name matches.
    expect(ds.get(`${HL}#med_5`)!.hits.map((h) => h.rule)).toContain("mh-medicines");
    expect(ds.get(`${HP}#hx_mdd`)!.hits.map((h) => `${h.rule}:${h.matched}`)).toContain("mh-icd10:F33.0");
  });

  test("the policy suggests sharing the medicine because sertraline may explain the low sodium", () => {
    const policy = presetPolicy("private");
    const ds = decide(parts, policy);
    const s = suggestions(ds);
    expect(s.map((x) => x.id)).toEqual(["antidepressant-low-sodium"]);
    expect(s[0].medicines).toEqual(["sertraline"]);
    expect(s[0].hidden.map((d) => d.key).sort()).toEqual([`${DC}#med_sertraline`, `${HL}#med_5`, `${LV}#na_sertraline`, `${HP}#med_sertraline`].sort());
    // Evidence: the hyponatremia diagnoses (E87.1) and the low sodium in the admission panel.
    const ev = s[0].evidence.map((d) => d.key);
    expect(ev).toContain(`${HP}#dx_na`);
    expect(ev).toContain(`${HP}#bmp`);
    expect(ev).toContain(`${LV}#dx_na`);
  });

  test("taking the suggestion re-shares the sertraline entries and keeps the diagnosis private", () => {
    const policy = presetPolicy("private");
    const [s] = suggestions(decide(parts, policy));
    const refined = s.apply(policy);
    expect(presetOf(refined)).toBe("private_meds");
    const ds = decide(parts, refined);
    expect(withheld(ds)).toEqual([`${HP}#hx_mdd`]);
    const med = ds.find((d) => d.key === `${HP}#med_sertraline`)!;
    expect(med.share).toBe(true);
    expect(med.via).toBe("medicine");
    expect(suggestions(ds)).toEqual([]);
  });

  test("an override wins over the policy", () => {
    const p = { ...presetPolicy("private_meds"), overrides: { [`${LV}#na_sertraline`]: "withhold" as const } };
    expect(presetOf(p)).toBe("custom");
    expect(withheld(decide(parts, p))).toEqual([`${HP}#hx_mdd`, `${LV}#na_sertraline`].sort());
  });

  test("a medicine withheld by a per-part choice also produces a suggestion, and the fix drops that choice", () => {
    const p = { ...presetPolicy("everything"), overrides: { [`${HL}#med_5`]: "withhold" as const } };
    const [s, ...rest] = suggestions(decide(parts, p));
    expect(rest).toEqual([]);
    expect(s.hidden.map((d) => d.key)).toEqual([`${HL}#med_5`]);
    expect(withheld(decide(parts, s.apply(p)))).toEqual([]);
  });
});

describe("the whole hero record", () => {
  const parts = allHeroParts();
  const old = /sertralin|zoloft|depress|\bmdd\b|\bF3[23](\.\d+)?\b|behavioral health/i;

  test("the rules find every part the old text pattern found, and nothing outside mental health", () => {
    const ds = decide(parts, presetPolicy("private"));
    const byOld = parts.filter((p) => old.test(p.spanTexts.join(" ") + " " + JSON.stringify(p.entry ?? "")) || (p.entry as any)?.restricted);
    const w = new Set(withheld(ds));
    for (const p of byOld) expect(w.has(`${p.item}#${p.id}`)).toBe(true);
    for (const d of ds.filter((d) => !d.share)) expect(d.categories).toEqual(["mental_health"]);
    expect(w.size).toBe(byOld.length);
  });
});

describe("rules", () => {
  test("ICD-10 ranges compare the first three characters", () => {
    expect(icdMatches("F33.0", "F20-F48")).toBe(true);
    expect(icdMatches("F17.210", "F10-F16")).toBe(false);
    expect(icdMatches("F17.210", "F18-F19")).toBe(false);
    expect(icdMatches("O09.513", "O00-O9A")).toBe(true);
    expect(icdMatches("Z71.41", "Z71.4")).toBe(true);
  });

  test("every category has at least one rule and a description", () => {
    for (const c of CATEGORIES) {
      expect(c.covers.length).toBeGreaterThan(20);
      expect(classify({ item: "x", source: "riverside", id: "u", hasEntry: false, spanTexts: [] }).length).toBe(0);
    }
  });

  test("a view-row source can supply categories alongside the rules", () => {
    const part = { item: "lakeview/x", source: "lakeview", id: "dx_9", hasEntry: true, spanTexts: [], entry: { type: "VISIT_DX", ICD10CM: "Z15.01" } };
    const rows = viewRowSource([{ item: "lakeview/x", unit: "dx_9", categories: ["genetic"], because: "Mapped to a genetic susceptibility problem." }]);
    expect(classify(part, [rows]).map((h) => h.category)).toEqual(["genetic"]);
    expect(classify(part, [ruleSource, rows]).map((h) => h.rule)).toEqual(["gen-icd10", "view rows"]);
  });

  test("presets round-trip through presetOf", () => {
    for (const p of PRESETS) expect(presetOf(presetPolicy(p.id))).toBe(p.id);
  });
});

describe("agent", () => {
  const parts = referralParts();
  const keys = new Set(parts.map((p) => `${p.item}#${p.id}`));

  test("the system prompt lists the parts, the purpose and the current concern", () => {
    const policy = presetPolicy("private");
    const ds = decide(parts, policy);
    const prompt = systemPrompt({
      items: [{ key: HP, title: "Admission H&P", source: "Riverside", date: "2024-11-02", alwaysShared: "author" }],
      decisions: ds,
      partSummary: (d) => d.part.spanTexts[0] ?? d.part.id,
      policy,
      suggestions: suggestions(ds),
    });
    expect(prompt).toContain(`${HP}#hx_mdd`);
    expect(prompt).toContain("WITHHELD");
    expect(prompt).toContain("sodium");
    expect(prompt).toContain("```policy");
  });

  test("replies parse; bad categories and unknown parts are refused", () => {
    expect(parseReply("Just a question.").policy).toBeUndefined();
    const ok = parseReply('Text.\n```policy\n{"private":["mental_health"],"shareMedicines":true}\n```', keys);
    expect(ok.text).toBe("Text.");
    expect(ok.policy).toEqual({ private: ["mental_health"], shareMedicines: true, overrides: {} });
    expect(parseReply('```policy\n{"private":["politics"]}\n```').error).toContain("politics");
    expect(parseReply('```policy\n{"private":[],"overrides":{"nope#x":"share"}}\n```', keys).error).toContain("nope#x");
    expect(parseReply("```policy\n{oops\n```").error).toContain("JSON");
  });

  test("the recorded conversation's policies do what its text says", () => {
    const replies = RECORDED.filter((t) => t.role === "assistant").map((t) => parseReply(t.content, keys));
    const last = replies.filter((r) => r.policy).at(-1)!;
    expect(replies.every((r) => !r.error)).toBe(true);
    expect(presetOf(last.policy!)).toBe("private_meds");
    // "Four parts change from held back to shared … Still private: the depression diagnosis."
    const before = new Set(withheld(decide(parts, presetPolicy("private"))));
    const after = new Set(withheld(decide(parts, last.policy!)));
    expect([...before].filter((k) => !after.has(k)).length).toBe(4);
    expect([...after]).toEqual([`${HP}#hx_mdd`]);
  });
});

// ─── what Linda reads ──────────────────────────────────────────────────────────────────────────

describe("descriptions come from the records and the current choice", () => {
  const parts = referralParts();
  const NAMES: Record<string, { name: string; medicineList?: boolean }> = {
    [HP]: { name: "your November 2024 hospital admission note" },
    [DC]: { name: "your November 2024 hospital discharge summary" },
    ["northgate/2024-11-12-visit-note.folio.md"]: { name: "your November 2024 primary-care visit note" },
    [HL]: { name: "your May HomeLog medicine list", medicineList: true },
    [LV]: { name: "your July kidney-clinic note" },
  };
  const opts = { names: (k: string) => NAMES[k], partLabel: (d: Decision) => d.part.spanTexts[0] ?? d.part.id, records: 5 };
  const sum = (p: ReturnType<typeof presetPolicy>) => describeShare(decide(parts, p), opts);
  const labels = (ms: { thing: { label: string } }[]) => ms.map((m) => m.thing.label);

  test("keep sensitive topics private: names the diagnosis and sertraline, and where they are", () => {
    const s = sum(presetPolicy("private"));
    expect(labels(s.withheld)).toEqual(["your depression diagnosis", "sertraline"]);
    expect(labels(s.shared)).toEqual([]);
    expect(s.text).toBe(
      "The clinic will not see your depression diagnosis (in your November 2024 hospital admission note) and sertraline (on three medicine lists and in one sentence of your July kidney-clinic note). It will see everything else in these five records.",
    );
  });

  test("share everything: says the clinic sees the diagnosis and sertraline", () => {
    const s = sum(presetPolicy("everything"));
    expect(s.withheld).toEqual([]);
    expect(labels(s.shared)).toEqual(["your depression diagnosis", "sertraline"]);
    expect(s.text).toBe("The clinic will see everything in these five records, including your depression diagnosis and sertraline.");
  });

  test("list all my medicines: hides the diagnosis, shows sertraline", () => {
    const s = sum(presetPolicy("private_meds"));
    expect(labels(s.withheld)).toEqual(["your depression diagnosis"]);
    expect(labels(s.shared)).toEqual(["sertraline"]);
    expect(s.text).toBe(
      "The clinic will not see your depression diagnosis (in your November 2024 hospital admission note). It will see sertraline (on three medicine lists and in one sentence of your July kidney-clinic note), and everything else in these five records. Doctors know what sertraline is usually taken for, so the clinic may guess why you take it.",
    );
  });

  test("a custom choice is described the same way", () => {
    const p = { ...presetPolicy("private_meds"), overrides: { [`${LV}#na_sertraline`]: "withhold" as const } };
    const s = sum(p);
    expect(presetOf(p)).toBe("custom");
    expect(s.withheld.map((m) => `${m.thing.label} (${m.where})`)).toEqual([
      "your depression diagnosis (in your November 2024 hospital admission note)",
      "sertraline (in one sentence of your July kidney-clinic note)",
    ]);
    expect(s.shared.map((m) => `${m.thing.label} (${m.where})`)).toEqual(["sertraline (on three medicine lists)"]);
    expect(topicState(s, "mental_health")).toEqual({
      seen: ["sertraline (on three medicine lists)"],
      hidden: ["your depression diagnosis", "sertraline (in one sentence of your July kidney-clinic note)"],
    });
    // Unticking mental health from the default leaves nothing private in these records.
    const off = { ...presetPolicy("private"), private: presetPolicy("private").private.filter((c) => c !== "mental_health") };
    expect(presetOf(off)).toBe("custom");
    expect(sum(off).text).toBe(sum(presetPolicy("everything")).text);
  });

  test("only mental health occurs; the other four go in one line", () => {
    const s = sum(presetPolicy("private"));
    expect(s.present).toEqual(["mental_health"]);
    expect(absentText(s)).toBe(
      "These records contain nothing about alcohol or drug use, sexual or reproductive health, HIV or other sexually transmitted infections, or genetic tests.",
    );
    expect(topicState(s, "mental_health")).toEqual({ seen: [], hidden: ["your depression diagnosis", "sertraline"] });
    expect(topicState(sum(presetPolicy("private_meds")), "mental_health")).toEqual({ seen: ["sertraline"], hidden: ["your depression diagnosis"] });
    expect(topicState(sum(presetPolicy("everything")), "mental_health")).toEqual({ seen: ["your depression diagnosis", "sertraline"], hidden: [] });
  });

  test("the record set drives the description", () => {
    const fewer = parts.filter((p) => p.item !== LV && p.item !== HL);
    const s = describeShare(decide(fewer, presetPolicy("private")), { ...opts, records: 3 });
    expect(s.text).toBe(
      "The clinic will not see your depression diagnosis (in your November 2024 hospital admission note) and sertraline (on two medicine lists). It will see everything else in these three records.",
    );
  });

  test("the context problem exists exactly when sertraline is withheld", () => {
    const cases: [string, ReturnType<typeof presetPolicy>, number][] = [
      ["private", presetPolicy("private"), 1],
      ["everything", presetPolicy("everything"), 0],
      ["private_meds", presetPolicy("private_meds"), 0],
      ["custom: one sentence withheld", { ...presetPolicy("private_meds"), overrides: { [`${LV}#na_sertraline`]: "withhold" } }, 1],
      ["custom: mental health shared", { ...presetPolicy("private"), private: ["genetic"] }, 0],
    ];
    for (const [name, p, n] of cases) {
      const ds = decide(parts, p);
      const sertralineHidden = ds.some((d) => !d.share && /sertraline/i.test(JSON.stringify(d.part)));
      expect([name, suggestions(ds).length]).toEqual([name, n]);
      expect([name, sertralineHidden]).toEqual([name, n > 0]);
    }
  });

  test("the recorded conversation starts from the default choice", () => {
    expect(RECORDED_START).toBe("private");
    expect(RECORDED.filter((t) => t.applies).length).toBe(1);
    expect(RECORDED.find((t) => t.applies)!.role).toBe("assistant");
  });
});
