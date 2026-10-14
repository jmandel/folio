import { transform } from "./transform.ts";
const names = ["metFORMIN 500 MG Oral Tablet","Ventolin HFA 90 mcg/actuation inhaler","amoxicillin trihydrate 500 mg capsule","24 HR metoprolol succinate 25 MG Extended Release Oral Tablet","insulin lispro 100 UNT/ML Injectable Solution [Humalog]","atorvastatin calcium 40 mg tablet","potassium chloride 20 MEQ Extended Release Oral Tablet","Lantus SoloStar 100 unit/mL","aspirin 81 MG Delayed Release Oral Tablet","sulfamethoxazole 800 MG / trimethoprim 160 MG Oral Tablet","losartan potassium 50 mg","buprenorphine 8 MG / naloxone 2 MG Sublingual Film","Docusate sodium 100 mg capsule","vitamin D3 1000 unit capsule"];
for (const n of names) {
  const r = transform([{folio:"0.1",id:"x",issuer:"i",patient:"p",effective:"2024-01-01",recorded:"2024-01-01T00:00:00-06:00",narrative:"",payload:{m:{type:"med_event",med_id:"1",action:"start",origin:"northgate",drug:{name:n},sig:"Take 2 tablets by mouth twice daily"}}}] as any,"2025-01-01");
  console.log(n, "=>", r.medications.map(m=>`${m.ingredient} ${JSON.stringify(m.dose)} ${m.frequency} ${m.sensitivity??""}`).join(" | "));
}
