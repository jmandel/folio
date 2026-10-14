import { transform } from "./transform";
import { readFileSync } from "fs";
const txt = readFileSync("in/feedback.md","utf8");
const blocks = [...txt.matchAll(/````markdown\n([\s\S]*?)\n````/g)].map(m=>m[1]);
const seen = new Map<string, any>();
for (const b of blocks) {
  const fm = b.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)!;
  const get=(k:string)=>fm[1].match(new RegExp("^"+k+': "(.*)"','m'))?.[1]!;
  const pj = fm[2].match(/```json payload\n([\s\S]*?)\n```/)!;
  const sup = fm[1].match(/^supersedes:.*$/m);
  seen.set(get("id"), {folio:"0.1",id:get("id"),issuer:get("issuer"),patient:get("patient"),effective:get("effective"),recorded:get("recorded"),narrative:fm[2],payload:JSON.parse(pj[1]), supersedes: sup? JSON.parse(sup[0].slice(11)):undefined});
}
const by = new Map<string, any[]>();
for (const i of seen.values()) (by.get(i.patient) ?? by.set(i.patient, []).get(i.patient)!).push(i);
for (const [p, its] of by) {
  const asOf = its.map(i=>i.recorded.slice(0,10)).sort().pop()!;
  console.log(p, asOf, its.length);
  const r = transform(its, asOf);
  console.log(JSON.stringify({labs:r.labs.map(l=>[l.analyte,l.value,l.collected]), vitals:r.vitals}, null, 0));
}
