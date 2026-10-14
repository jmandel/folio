import { transform } from "./transform.ts";
const names = ["losartan potassium 50 MG Oral Tablet","metformin hydrochloride 500 MG Extended Release Oral Tablet","Farxiga 10 mg tablet","insulin glargine 100 UNT/ML Pen Injector [Lantus]","lisinopril 20 MG / hydrochlorothiazide 12.5 MG Oral Tablet","potassium chloride 20 MEQ Extended Release Oral Tablet","atorvastatin calcium 40 MG Oral Tablet","sertraline 50 MG Oral Tablet","24 HR metoprolol succinate 50 MG Extended Release Oral Tablet","Kerendia","empagliflozin 10 MG Oral Tablet [Jardiance]"];
const base = {folio:"0.1",issuer:"x",patient:"p",narrative:""};
const mk=(id:string,eff:string,rec:string,payload:any,extra:any={})=>({...base,id,effective:eff,recorded:rec,payload,...extra});
const med=(id:string,action:string,name:string,extra:any={})=>({type:"med_event",med_id:id,action,origin:"northgate",drug:{name},dose:{value:1,unit:"tab"},frequency:"QD",...extra});
const items:any[]=[
 ...names.map((n,i)=>mk("m"+i,"2024-01-0"+((i%9)+1)+"T10:00:00-06:00","2024-01-0"+((i%9)+1)+"T10:00:00-06:00",{m:med("L"+i,"start",n)})),
 mk("h1","2024-03-01T10:00:00-06:00","2024-03-01T10:00:00-06:00",{m:med("L0","hold","losartan potassium 50 MG Oral Tablet",{reason_text:"AKI"})}),
 mk("s1","2024-04-01T10:00:00-05:00","2024-04-01T10:00:00-05:00",{m:med("L7","stop","sertraline 50 MG Oral Tablet",{stop_reason:"patient_choice",restricted:"BH"})}),
 mk("p1","2020-01-01","2020-01-01T10:00:00-06:00",{p:{type:"problem_event",problem_id:"P1",action:"add",description:"Chronic kidney disease stage 3a",icd10cm:"N18.31",onset:{date:"2019-01-01",precision:"year"}}}),
 mk("p2","2023-01-01","2023-01-01T10:00:00-06:00",{p:{type:"problem_event",problem_id:"P1",action:"update",description:"Chronic kidney disease stage 3b, A3",icd10cm:"N18.32"}}),
 mk("p3","2023-01-01","2023-01-01T10:00:00-06:00",{p:{type:"problem_event",problem_id:"P2",action:"add",description:"Adverse effect of ACE inhibitors",icd10cm:"T46.4X5A"}}),
 mk("p4","2023-01-01","2023-01-01T10:00:00-06:00",{p:{type:"problem_event",problem_id:"P3",action:"add",description:"Euglycemic diabetic ketoacidosis due to empagliflozin",icd10cm:"E11.10"}}),
 mk("p5","2023-01-01","2023-01-01T10:00:00-06:00",{p:{type:"problem_event",problem_id:"P4",action:"add",description:"Depression",icd10cm:"F32.A",restricted:"BH"}}),
 mk("L1","2024-01-01T08:00:00-06:00","2024-01-01T12:00:00-06:00",{a:{type:"imported_result",test:{nfm_code:"PLT",name:"Platelet count"},value:"212000",unit:"cells/uL",result_status:"P",collected:"2024-01-01T14:00:00Z",resulted:"",external_ref:{lab:"Lakeview Labs",accession:"A1",result_code:"LK-PLT"}}}),
 mk("L2","2024-01-01T08:00:00-06:00","2024-01-02T12:00:00-06:00",{a:{type:"imported_result",test:{nfm_code:"PLT",name:"Platelet count"},value:"215000",unit:"cells/uL",result_status:"F",collected:"2024-01-01T14:00:00Z",resulted:"",external_ref:{lab:"Lakeview Labs",accession:"A1",result_code:"LK-PLT"}},
   e:{type:"imported_result",test:{nfm_code:"EGFR-CKDEPI21",name:"eGFR"},value:">90",unit:"mL/min/1.73m2",result_status:"F",collected:"2024-01-01T08:00:00",resulted:"",comment:"CKD-EPI 2021 race-free",external_ref:{lab:"Lakeview Labs",accession:"A1",result_code:"LK-EGFR21"}}},{supersedes:["L1"]}),
];
console.log(JSON.stringify(transform(items as any,"2026-01-01"),null,1));
console.log(JSON.stringify(transform(items as any,"2024-01-01").labs));
