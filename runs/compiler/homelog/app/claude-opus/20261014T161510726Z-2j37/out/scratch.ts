import { transform } from "./transform.ts";
import { readFileSync } from "node:fs";
const g = JSON.parse(readFileSync("../in/samples/samples.json","utf8"));
const r = transform(g[1].items, "2026-10-13");
console.log(JSON.stringify(r.medications.map(m=>[m.drug_name,m.ingredient,m.dose,m.frequency,m.otc]) ), r.vitals.length);
console.log(transform(g[0].items, "2024-05-01").medications[0].evidence, transform(g[0].items, "2024-01-01"));
const mk = (payload:any, extra:any={}) => ({folio:"0.1",id:"X"+Math.random(),issuer:"i",patient:"p",effective:"2025-01-01",recorded:"2025-01-02T00:00:00Z",narrative:"My Medicines",payload, ...extra});
const t = transform([mk({
 a:{type:"my_med",homelog_med_id:"a",name:"Lantus",strength_text:"100 units/mL",how_i_take_it:"10 units at bedtime",status:"taking",kind:"prescription"},
 b:{type:"my_med",homelog_med_id:"b",name:"Pepcid",strength_text:"10 mg",how_i_take_it:"take 2 tablets twice a day",status:"taking",kind:"over_the_counter"},
 c:{type:"my_med",homelog_med_id:"c",name:"Ventolin HFA",strength_text:"90 mcg/puff",how_i_take_it:"2 puffs as needed",status:"taking",kind:"prescription"},
 d:{type:"my_med",homelog_med_id:"d",name:"Eliquis",strength_text:"5 mg",how_i_take_it:"morning and night",status:"taking",note:"holding until after knee surgery",kind:"prescription"},
 e:{type:"my_med",homelog_med_id:"e",name:"Amoxicillin",strength_text:"500 mg",how_i_take_it:"3 times a day",status:"stopped",stopped:"2024-06",note:"gave me a rash",kind:"prescription"},
 f:{type:"my_med",homelog_med_id:"f",name:"Seroquel",strength_text:"50 mg",how_i_take_it:"2 at bedtime",status:"taking",started:"2019",kind:"prescription"},
}), mk({g:{type:"glucose_reading",measured_at:"2025-01-01T07:00",value:5.5,unit:"mmol/L",entry_method:"meter_sync"},
 h:{type:"glucose_reading",measured_at:"2025-01-01T07:01",value:99,unit:"mg/dL",entry_method:"typed"},
 i:{type:"glucose_reading",measured_at:"2025-01-01T09:01",value:600,unit:"mg/dL",out_of_range:"HI",entry_method:"meter_sync"},
 j:{type:"bp_reading",measured_at:"2025-01-01T12:00:00Z",systolic_mmhg:120,diastolic_mmhg:80,entry_method:"typed"}})], "2025-01-05");
console.log(JSON.stringify(t,null,1));
