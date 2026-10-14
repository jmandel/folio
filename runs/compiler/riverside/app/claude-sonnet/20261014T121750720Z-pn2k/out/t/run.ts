import { transform } from "../transform";
import { readFileSync } from "fs";
const fb = readFileSync("in/feedback.md","utf8");
const blocks = [...fb.matchAll(/````markdown\n([\s\S]*?)\n````/g)].map(m=>m[1]);
const seen = new Map<string,any>();
for (const b of blocks) {
  const fm = b.match(/^---\n([\s\S]*?)\n---\n([\s\S]*?)```json payload\n([\s\S]*?)\n```/)!;
  const g=(k:string)=>fm[1].match(new RegExp("^"+k+': "(.*)"','m'))?.[1];
  const it:any={folio:"0.1",id:g("id"),issuer:g("issuer"),patient:g("patient"),effective:g("effective"),recorded:g("recorded"),narrative:fm[2],payload:JSON.parse(fm[3])};
  seen.set(it.id,it);
}
for (const it of seen.values()) {
  const asOf = new Date(Date.parse(it.recorded)-6*3600e3).toISOString().slice(0,10);
  const r = transform([it], asOf);
  console.log(it.patient, it.id, asOf, "vitals", JSON.stringify(r.vitals.map(v=>[v.local_time,v.systolic_mmhg])), "labs", r.labs.length, r.labs.filter(l=>l.analyte=="troponin").map(l=>l.collected+l.comparator+l.value).join(","),"prob",r.problems.map(p=>p.condition).join("|"),"alg",r.allergies.map(a=>a.substance+":"+a.type).join("|"));
}
