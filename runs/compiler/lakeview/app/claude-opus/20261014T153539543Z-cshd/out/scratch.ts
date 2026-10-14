import { transform } from "./transform.ts";
const names = ["losartan potassium 50 mg tablet","sodium bicarbonate 650 mg tablet","potassium chloride ER 20 mEq tablet","atorvastatin calcium 40 mg tablet","losartan-hydrochlorothiazide 50-12.5 mg tablet","Kerendia 10 mg tablet","insulin glargine 100 unit/mL pen","sevelamer carbonate 800 mg tablet","empagliflozin 10 mg tablet","calcitriol 0.25 mcg capsule","darbepoetin alfa 40 mcg/0.4 mL syringe"];
const mk=(n:string,i:number)=>({folio:"0.1",id:"X"+i,issuer:"x",patient:"p",effective:"2024-01-01T10:00:00-06:00",recorded:"2024-01-01T12:00:00-06:00",narrative:"",payload:{rx:{type:"MED_ORDER",RX_ID:"RX"+i,VISIT_ID:"V",LV_DRUG_ID:"L",DRUG_NAME:n,DOSE_QTY:1,DOSE_UNIT:"mg",ROUTE:"PO",FREQ_CODE:"QD",MED_STATUS:1,START_DATE:"2024-01-01",PRESCRIBER_NPI:"1"}}});
const r = transform(names.map(mk) as any, "2024-02-01");
for (const m of r.medications) console.log(m.drug_name, "=>", m.ingredient, m.dose?.value);
// asOf boundary: recorded 2024-01-02T03:00Z is 2024-01-01 21:00 local
const it:any = mk("lisinopril 10 mg tablet", 99); it.recorded="2024-01-02T03:00:00Z";
console.log(transform([it], "2024-01-01").medications.length, transform([it], "2023-12-31").medications.length);
