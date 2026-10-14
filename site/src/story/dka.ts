// The front page's worked example: Linda's empagliflozin euglycemic DKA (Nov 2024) as each source
// recorded it. Every excerpt names a real signed item (source dir + item id) and the ref ids to show;
// the page loads, verifies and quotes those items, so nothing here is copied text.
//
// The merged result lives in dka-merged.json (see work/story-receipt.md for its shape). Today it is
// the answer key; compiled-mapper output with the same shape can replace it.

import merged from "./dka-merged.json";

export interface ExcerptRef {
  /** Ref id: a payload entry id, a narrative-only span id, or both. */
  ref: string;
  /** Dotted paths into the payload entry to show (in this order). */
  fields?: string[];
}
export interface Excerpt {
  source: "riverside" | "northgate" | "lakeview" | "homelog";
  /** Envelope id of the signed item. */
  item: string;
  refs: ExcerptRef[];
}
export interface SourceColumn {
  source: Excerpt["source"];
  /** One or two plain sentences on how this source records the fact. */
  caption: string;
  excerpts: Excerpt[];
}

export const DKA_COLUMNS: SourceColumn[] = [
  {
    source: "riverside",
    caption: "The discharge summary marks the drug held, with advice not to restart it.",
    excerpts: [{ source: "riverside", item: "01JBZ2V178F5KZNWJ47TAN9ZT2", refs: [{ ref: "med_empa", fields: ["status", "restart_advice"] }] }],
  },
  {
    source: "northgate",
    caption: "A week later the family doctor records a stop event, and a separate allergy event.",
    excerpts: [
      { source: "northgate", item: "01JCGH7E98RHEM3E2MSH4DMDZS", refs: [{ ref: "med_1", fields: ["action", "stop_reason"] }] },
      { source: "northgate", item: "01JCGHC7KGRYX1DZWYB8RTCAM0", refs: [{ ref: "alg_1", fields: ["reaction_type", "severity"] }] },
    ],
  },
  {
    source: "lakeview",
    caption: "The DKA is a coded history diagnosis (status H). The decision not to re-try the drug is only in the note text.",
    excerpts: [
      {
        source: "lakeview",
        item: "01KXEQKXQGGFWM3XCNV7YSNJGV",
        refs: [{ ref: "sglt2_decision" }, { ref: "dx_dka_hx", fields: ["ICD10CM", "DX_STATUS"] }],
      },
    ],
  },
  {
    source: "homelog",
    caption: "Linda's diary is the only record that she kept taking her pills while she was sick.",
    excerpts: [
      { source: "homelog", item: "01JBK1YV20HTJ26YZXQFQAKCMZ", refs: [{ ref: "note_1", fields: ["symptom_tags"] }] },
      { source: "homelog", item: "01KQN2FD70GFSXF3DM02V7HGMX", refs: [{ ref: "med_8", fields: ["name", "status", "note"] }] },
    ],
  },
];

/** One citation: (source, item id, ref id). */
export interface Cite {
  source: Excerpt["source"];
  item: string;
  ref: string;
}
export interface MergedPart {
  label: string;
  text: string;
  cites: Cite[];
}
export interface MergedRow {
  /** The consumer view this row belongs to ("Medications", "Allergies and intolerances", a FHIR type…). */
  view: string;
  title: string;
  parts: MergedPart[];
}
export interface MergedResult {
  /** "answer-key": written by hand from the truth. "compiled-mapper": produced by cached mapper code. */
  kind: "answer-key" | "compiled-mapper";
  patient: string;
  /** Where this result came from, in one sentence (mapper ids and schema hashes for compiled output). */
  basis: string;
  rows: MergedRow[];
}

export const DKA_MERGED = merged as MergedResult;

/** Every item the page needs to load and verify. */
export function storyItems(): { source: string; item: string }[] {
  const seen = new Map<string, { source: string; item: string }>();
  for (const c of DKA_COLUMNS) for (const e of c.excerpts) seen.set(e.item, { source: e.source, item: e.item });
  for (const r of DKA_MERGED.rows) for (const p of r.parts) for (const c of p.cites) seen.set(c.item, { source: c.source, item: c.item });
  return [...seen.values()];
}
