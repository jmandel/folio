import { transform } from "./transform.ts";
const junk: any[] = [null, 5, {id:"a"}, {id:"b",recorded:"garbage",payload:null}, {id:"c",recorded:"2024-01-01T00:00:00Z",effective:null,payload:{x:{type:"med_event"},y:{type:"vital_set",bp:5},z:{type:"imported_result",value:null},w:{type:"problem_event",problem_id:"1",action:"add"},v:{type:"allergy_event",allergy_id:"1",action:"add",substance:null}}}];
console.log(JSON.stringify(transform(junk as any, "2025-01-01")));
console.log(JSON.stringify(transform(undefined as any, "2025-01-01")));
