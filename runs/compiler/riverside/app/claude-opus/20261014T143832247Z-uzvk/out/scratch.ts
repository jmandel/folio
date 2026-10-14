import { transform } from "./transform.ts";
const g = JSON.parse(await Bun.file("in/samples/samples.json").text());
const items = g[0].items;
console.log(JSON.stringify(transform([null, 3, {}, {id:"x",recorded:"bad",payload:{a:null,b:{type:"panel",components:"x"}}}] as any, "2026-01-01")));
// retract the consult and the discharge summary
const r = [...items, {...items[0], id:"R1", recorded:"2025-05-01T00:00:00Z", payload:{}, supersedes:undefined, retracts:["01JT1NRCX0R76WG8R1DPZ2JFFW","01GXW37630HYEJYZ8WXWG05528"]}];
const out = transform(r, "2026-01-01");
console.log(out.medications.map(m=>[m.ingredient,m.status,m.evidence[0].item_id]), out.problems.map(p=>[p.condition,p.status]));
// prelim lab + race eGFR
const lab = {id:"L1",issuer:items[0].issuer,recorded:"2025-06-01T00:00:00Z",effective:"2025-06-01",narrative:"",payload:{p:{type:"panel",panel:{local_code:"BMP",name:"x"},accession:"A",collected:"2025-06-01T08:00:00-05:00",specimen:"serum",status:"preliminary",components:[{test:{local_code:"EGFR",name:"eGFR (CKD-EPI 2009), African American"},value:">60",unit:"mL/min/1.73m2"},{test:{local_code:"EGFRN",name:"eGFR (CKD-EPI 2009), non-African American"},value:"55",unit:"mL/min/1.73m2"},{test:{local_code:"GLU",name:"Glucose"},value:"5.5",unit:"mmol/L"}]}}};
console.log(JSON.stringify(transform([lab] as any,"2026-01-01").labs));
