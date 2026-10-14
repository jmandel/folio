import { transform } from "./transform.ts";
const g = JSON.parse(await Bun.file("../in/samples/samples.json").text());
const items = g[0].items;
for (const d of ["2021-07-10","2021-07-11","2021-10-07","2022-01-11"]) {
  const r = transform(items, d);
  console.log(d, r.labs.length, r.medications.map(m=>m.status+" "+m.status_since), r.problems.map(p=>p.icd10cm+" "+p.ckd_stage), r.vitals.length);
}
const base = items.find((i:any)=>i.id==="01FABHX3J0XX0A6XERR81ZHGZ9");
const mk = (id:string, rec:string, mod:(p:any)=>void, extra:any={}) => { const p = JSON.parse(JSON.stringify(base.payload)); mod(p); return {...base, id, recorded: rec, supersedes: undefined, ...extra, payload: p}; };
const a = mk("P1","2024-03-10T08:00:00Z", p=>{ p.req.COLLECTED_AT="2024-03-10T01:30:00"; p.res_creat.RESULT_ID="X1"; p.res_creat.RESULT_STATUS="P"; p.res_egfr_n.TEST_CODE="LK-EGFR21"; p.res_egfr_n.VALUE_TEXT=">90"; p.res_egfr_n.VALUE_NUM=9999999; p.res_egfr_n.RESULT_ID="X2"; p.res_egfr_n.COMMENT_TEXT=undefined; p.ord_na.ORDER_STATUS=9; p.res_na.RESULT_ID="X3"; p.res_k.RESULT_ID="X4"; p.res_a1c.RESULT_ID="X5"; delete p.res_egfr_a;});
const b = mk("F1","2024-03-11T08:00:00Z", p=>{ p.req.COLLECTED_AT="2024-03-10T03:30:00"; p.res_creat.RESULT_ID="X1"; p.res_creat.RESULT_STATUS="F"; p.res_creat.VALUE_TEXT="1.20"; delete p.res_egfr_n; delete p.res_egfr_a; delete p.res_na; delete p.res_k; delete p.res_a1c;});
console.log(JSON.stringify(transform([a,b] as any, "2024-03-12").labs, null, 1));
console.log(JSON.stringify(transform([a] as any, "2024-03-10").labs.map(l=>[l.analyte,l.status,l.collected]), null, 0));
// med resume and stop
const c1 = items.find((i:any)=>i.id==="01FHGSVF90T6FY14BZAE7SP5TX");
const res = {...c1, id:"R1", recorded:"2022-01-01T10:00:00-06:00", payload:{ h:{...c1.payload.hold_finerenone, HIST_ID:"MH-2", OLD_STATUS:3, NEW_STATUS:1, CHANGED_AT:"2021-12-01T10:00:00-06:00", REASON_CODE:"LAB", COMMENT_TEXT:"K ok"}}};
const stop = {...c1, id:"S1", recorded:"2022-02-01T10:00:00-06:00", payload:{ h:{...c1.payload.hold_finerenone, HIST_ID:"MH-3", OLD_STATUS:1, NEW_STATUS:2, CHANGED_AT:"2022-02-01T10:00:00-06:00", REASON_CODE:"ADR", COMMENT_TEXT:"gyn"}}};
console.log(JSON.stringify(transform([...items,res,stop], "2022-01-15").medications.map(m=>[m.status,m.status_since,m.status_reason_text])));
console.log(JSON.stringify(transform([...items,res,stop], "2022-03-15").medications.map(m=>[m.status,m.status_since,m.stop_reason])));
console.log(JSON.stringify(transform([...items,{...stop,id:"RT",retracts:["S1"],payload:{}}], "2022-03-15").medications.map(m=>[m.status,m.status_since])));
