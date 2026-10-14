import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const groups = JSON.parse(readFileSync("in/samples/samples.json", "utf8"));
console.log(JSON.stringify(transform([] as any, "2026-01-01")));
console.log(JSON.stringify(transform([null, 1, {id:"x"}, {id:"y", recorded:"2025-01-01T00:00:00Z", payload: {a: {type:"panel", components: [null]}, b:{type:"vitals", taken:"bad"}, c:{type:"home_med"}, d:{type:"diagnosis", status:"active"}}}] as any, "2026-01-01")));
// supersede the discharge summary with a retraction
const items = groups[0].items.map((x: any) => structuredClone(x));
const ds = items.find((i: any) => i.payload.enc.document_kind === "discharge_summary");
const corr = structuredClone(ds); corr.id = "CORR"; corr.supersedes = [ds.id]; corr.recorded = "2025-06-27T15:00:00Z";
corr.payload.med_metformin.status = "stopped"; corr.payload.med_metformin.instructions = "Stopped: replaced by insulin";
corr.payload.alg_x = { type: "allergy", substance: "Lisinopril", rxnorm_ingredient: "29046", reaction: "cough", severity: "mild" };
corr.payload.bmp_dc.components[6].value = "<0.5"; corr.payload.bmp_dc.status = "corrected";
const r = transform([...items, corr], "2026-01-01");
console.log(JSON.stringify(r.medications.find(m => m.ingredient === "metformin")), JSON.stringify(r.allergies), JSON.stringify(r.labs.filter(l => l.analyte === "creatinine")));
