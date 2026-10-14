import { transform } from "./transform.ts";
let n=0;
const it=(eff:string,rec:string,payload:any,extra:any={})=>({folio:"0.1",id:"I"+(n++),issuer:"did:web:northgate-fm.example",patient:"P1",effective:eff,recorded:rec,narrative:"",payload,author:{name:"Dr X"},...extra});
const med=(id:string,action:string,name:string,o:any={})=>({m:{type:"med_event",med_id:id,action,origin:"northgate",drug:{name},...o}});
const items:any[]=[
 it("2022-01-05T10:00:00-06:00","2022-01-05T10:00:00-06:00",med("ML-1","start","losartan potassium 50 MG Oral Tablet",{dose:{value:2,unit:"tab"},frequency:"QD",sig:"2 tabs daily"})),
 it("2023-03-01T10:00:00-06:00","2023-03-01T10:00:00-06:00",med("ML-1","hold","losartan potassium 50 MG Oral Tablet",{reason_text:"AKI",review_on:"2023-04-01"})),
 it("2022-01-05T10:00:00-06:00","2022-01-05T10:00:00-06:00",med("ML-2","start","Jardiance 10 mg",{origin:"outside",drug:{name:"Jardiance 10 mg",outside_code:{system:"lakeview-drug",code:"X"}}})),
 it("2023-05-01T10:00:00-05:00","2023-05-01T10:00:00-05:00",med("ML-2","stop","Jardiance 10 mg",{origin:"outside",stop_reason:"adverse_reaction",drug:{name:"Jardiance 10 mg"}})),
 it("2023-06-01T10:00:00-05:00","2023-06-01T10:00:00-05:00",med("ML-3","start","sertraline 50 MG Oral Tablet",{restricted:"BH"})),
 it("2024-06-01T10:00:00-05:00","2024-06-01T10:00:00-05:00",med("ML-4","start","sertraline 100 MG Oral Tablet",{restricted:"BH"})),
 it("2024-07-01T10:00:00-05:00","2024-07-01T10:00:00-05:00",med("ML-5","start","furosemide 40 MG Oral Tablet"),{id:"VOIDME"}),
 it("2024-07-02T10:00:00-05:00","2024-07-02T10:00:00-05:00",{v:{type:"chart_correction",voided_items:["VOIDME"],reason:"wrong_patient"}},{retracts:["VOIDME"]}),
 it("2024-01-02T08:00:00-06:00","2024-01-02T09:00:00-06:00",{p:{type:"imported_result",test:{nfm_code:"PLT",name:"Platelet count"},value:"212000",unit:"cells/uL",result_status:"P",collected:"2024-01-02T08:00:00-06:00",external_ref:{accession:"A1",result_code:"LK-PLT"}},
   e:{type:"imported_result",test:{nfm_code:"EGFR",name:"eGFR"},value:">90",unit:"mL/min/1.73m2",result_status:"F",collected:"2024-01-02T08:00:00-06:00",comment:"CKD-EPI 2021 race-free equation",external_ref:{accession:"A1",result_code:"LK-EGFR21"}}},{id:"PRE"}),
 it("2024-01-02T08:00:00-06:00","2024-01-03T09:00:00-06:00",{p:{type:"imported_result",test:{nfm_code:"PLT",name:"Platelet count"},value:"215000",unit:"cells/uL",result_status:"F",collected:"2024-01-02T08:00:00-06:00",external_ref:{accession:"A1",result_code:"LK-PLT"}}},{supersedes:["PRE"]}),
];
console.log(JSON.stringify(transform(items as any,"2026-01-01"),null,1));
