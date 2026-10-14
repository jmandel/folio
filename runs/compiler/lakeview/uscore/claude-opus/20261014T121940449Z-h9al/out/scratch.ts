import { transform } from "./transform.ts";
const S = JSON.parse(await Bun.file("in/samples/samples.json").text());
const p1 = S[0].items, p2 = S[1].items;
console.log(JSON.stringify(transform(p1, "2026-03-02").medicationRequests.map(m=>[m.status,m.authoredOn])));
console.log(transform(p1, "2025-01-01").medicationRequests.length);
// restart same day, error order, P result, void order
const base = p1.find((i:any)=>i.payload.rx_finerenone);
const restart = structuredClone(base); restart.id="X1"; restart.recorded="2026-08-01T10:00:00-05:00"; restart.effective=restart.recorded;
restart.payload = { visit:{type:"CLINIC_VISIT",VISIT_ID:"NV-1"},
  stop:{type:"MED_STATUS_HIST",HIST_ID:"MH-1",VISIT_ID:"NV-1",RX_ID:"RX-25246",OLD_STATUS:3,NEW_STATUS:2,CHANGED_AT:"2026-08-01T10:05:00-05:00",REASON_CODE:"OTH",COMMENT_TEXT:"dose change"},
  rx:{...base.payload.rx_finerenone, RX_ID:"RX-2", VISIT_ID:"NV-1", DRUG_NAME:"finerenone 20 mg tablet", DOSE_QTY:20, START_DATE:"2026-08-01"},
  rx9:{...base.payload.rx_finerenone, RX_ID:"RX-3", DRUG_NAME:"losartan potassium 50 mg tablet", RXNORM:"979492", MED_STATUS:9}};
console.log(JSON.stringify(transform([...p1, restart], "2026-10-13").medicationRequests, null, 1));
const lab = structuredClone(p2.find((i:any)=>i.id==="01HWTMFXX0N2ECCT9K2H66Z8EQ")); lab.id="L2"; 
lab.payload.res_na.RESULT_STATUS="P"; lab.payload.ord_creat.ORDER_STATUS=9; lab.payload.res_a1c.VALUE_TEXT="See comment";
console.log(transform([lab],"2026-01-01").observations.map(o=>[o.code.text,o.status,o.valueQuantity.value]));
