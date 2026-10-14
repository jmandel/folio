// Checks every distinct RxNorm, LOINC and ICD-10-CM code that appears in corpus/ (and in the
// generator's catalog) against NLM services, and compares the official name with what we print.
// Rerun after any catalog or renderer change:
//
//   bun work/verify-codes.ts            writes work/code-verification.json, exits 1 on a mismatch
//
// RxNorm: RxNav https://rxnav.nlm.nih.gov/REST/rxcui/<id>/properties.json (name, TTY).
// LOINC and ICD-10-CM: NLM Clinical Tables https://clinicaltables.nlm.nih.gov/api/{loinc_items,icd10cm}/v3/search.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { ANALYTES, DRUGS } from "../packages/truth/src/catalog.ts";

const ROOT = resolve(import.meta.dir, "..");
type Kind = "rxnorm" | "loinc" | "icd10cm";
const seen = new Map<string, { kind: Kind; code: string; ours: Set<string>; where: Set<string> }>();
const add = (kind: Kind, code: unknown, ours: unknown, where: string) => {
  if (typeof code !== "string" || !code) return;
  const k = `${kind}:${code}`;
  const e = seen.get(k) ?? seen.set(k, { kind, code, ours: new Set(), where: new Set() }).get(k)!;
  if (typeof ours === "string" && ours) e.ours.add(ours);
  if (e.where.size < 3) e.where.add(where);
};

// Catalog.
for (const d of Object.values(DRUGS)) {
  add("rxnorm", d.ingredientRx, d.ingredient, `catalog ${d.key} (ingredient)`);
  add("rxnorm", d.scd, d.scdName, `catalog ${d.key} (SCD)`);
}
for (const [a, x] of Object.entries(ANALYTES)) add("loinc", x.loinc, x.name, `catalog analyte ${a}`);

// Corpus payloads (walk every value; codes sit next to their display in each source's own shape).
function walk(v: any, where: string) {
  if (Array.isArray(v)) return v.forEach((x) => walk(x, where));
  if (!v || typeof v !== "object") return;
  if (v.rxnorm) add("rxnorm", v.rxnorm, v.name ?? v.display, where);
  if (v.rxnorm_ingredient) add("rxnorm", v.rxnorm_ingredient, v.substance ?? (v.drug_name ? undefined : undefined), where);
  if (v.RXNORM) add("rxnorm", v.RXNORM, v.DRUG_NAME, where);
  if (v.picked_from_search) add("rxnorm", v.picked_from_search.rxnorm, v.picked_from_search.display, where);
  if (v.loinc) add("loinc", v.loinc, v.name, where);
  if (v.LOINC) add("loinc", v.LOINC, v.TEST_NAME, where);
  if (v.icd10cm) add("icd10cm", v.icd10cm, v.display ?? v.label, where);
  if (v.ICD10CM) add("icd10cm", v.ICD10CM, v.DX_TEXT, where);
  for (const x of Object.values(v)) walk(x, where);
}
for (const dir of ["riverside", "northgate", "lakeview", "homelog"]) {
  for (const pat of readdirSync(join(ROOT, "corpus", dir))) {
    for (const f of readdirSync(join(ROOT, "corpus", dir, pat))) {
      const text = readFileSync(join(ROOT, "corpus", dir, pat, f), "utf8");
      const m = text.match(/(`{3,})json payload\n([\s\S]*?)\n\1\s*$/);
      if (m) walk(JSON.parse(m[2]), `${dir}/${pat}/${f}`);
    }
  }
}

async function getJson(url: string): Promise<any> {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.json();
    } catch { /* retry */ }
    await Bun.sleep(500 * (i + 1));
  }
  throw new Error(`fetch failed: ${url}`);
}

/** Codes whose official name differs from our display on purpose or by synonym. */
const ACCEPTED: Record<string, string> = {
  "loinc:48642-3": "Deliberate (T11): Lakeview mapped its CKD-EPI 2009 non-AA rows to the MDRD LOINC and never fixed it; documented in its schema.",
  "loinc:48643-1": "Deliberate (T11): as 48642-3, for the African American rows.",
  "loinc:2028-9": "Synonym: total CO2 is reported as bicarbonate.",
  "loinc:6690-2": "Synonym: leukocytes = white blood cells (WBC).",
  "icd10cm:E11.10": "Our text is the clinician's label (euglycemic DKA); the code is the right ICD-10-CM category.",
};
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
type Result = { kind: Kind; code: string; official?: string; tty?: string; ours: string[]; ok: boolean; note?: string; where: string[] };
const results: Result[] = [];
const entries = [...seen.values()].sort((a, b) => a.kind.localeCompare(b.kind) || a.code.localeCompare(b.code));
let i = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (i < entries.length) {
    const e = entries[i++];
    const base: Result = { kind: e.kind, code: e.code, ours: [...e.ours], ok: false, where: [...e.where] };
    try {
      if (e.kind === "rxnorm") {
        const j = await getJson(`https://rxnav.nlm.nih.gov/REST/rxcui/${e.code}/properties.json`);
        const p = j?.properties;
        if (!p) { results.push({ ...base, note: "unknown or retired RxCUI" }); continue; }
        // Our text must be the concept's name, or (for an ingredient) contained in it.
        // Sources print their own names ("finerenone 10 mg tablet"): same ingredient and strength is enough.
        const nums = (s: string) => (s.match(/\d+(\.\d+)?/g) ?? []).join(" ");
        const loose = (o: string) => norm(p.name).includes(norm(o).split(" ")[0]) && nums(o) === nums(p.name.replace(/^\d+ ML /, ""));
        const ok = base.ours.every((o) => norm(o) === norm(p.name) || (p.tty === "IN" && norm(o).includes(norm(p.name))) || (p.tty !== "IN" && loose(o)));
        results.push({ ...base, official: p.name, tty: p.tty, ok, note: ok ? undefined : "name differs" });
      } else {
        const api = e.kind === "loinc" ? "loinc_items" : "icd10cm";
        const df = e.kind === "loinc" ? "LOINC_NUM,LONG_COMMON_NAME" : "code,name";
        const sf = e.kind === "loinc" ? "LOINC_NUM" : "code";
        const j = await getJson(`https://clinicaltables.nlm.nih.gov/api/${api}/v3/search?sf=${sf}&df=${df}&terms=${encodeURIComponent(e.code)}&maxList=50`);
        const hit = (j?.[3] ?? []).find((x: string[]) => x[0] === e.code);
        if (!hit) { results.push({ ...base, note: `not found in ${e.kind === "loinc" ? "LOINC" : "ICD-10-CM"}` }); continue; }
        // Our display must share its key words with the official name (a human reads the list for LOINC).
        const words = (s: string) => new Set(norm(s).split(" ").filter((w) => w.length > 3));
        const off = words(hit[1]);
        const ok = base.ours.every((o) => [...words(o)].some((w) => [...off].some((x) => x.startsWith(w.slice(0, 5)) || w.startsWith(x.slice(0, 5)))));
        results.push({ ...base, official: hit[1], ok, note: ok ? undefined : "display shares no key word with the official name" });
      }
    } catch (err) {
      results.push({ ...base, note: String(err) });
    }
  }
}));
for (const r of results) if (!r.ok && ACCEPTED[`${r.kind}:${r.code}`] && r.official) { r.ok = true; r.note = ACCEPTED[`${r.kind}:${r.code}`]; }
results.sort((a, b) => a.kind.localeCompare(b.kind) || a.code.localeCompare(b.code));
writeFileSync(join(ROOT, "work", "code-verification.json"), JSON.stringify(results, null, 1) + "\n");
const bad = results.filter((r) => !r.ok);
for (const k of ["rxnorm", "loinc", "icd10cm"] as Kind[]) {
  const rs = results.filter((r) => r.kind === k);
  console.log(`${k}: ${rs.length} codes, ${rs.filter((r) => r.ok).length} ok`);
}
for (const b of bad) console.log(` - ${b.kind} ${b.code}: ours ${JSON.stringify(b.ours)} | NLM ${JSON.stringify(b.official ?? null)} ${b.tty ?? ""} (${b.note}) e.g. ${b.where[0]}`);
process.exit(bad.length ? 1 : 0);
