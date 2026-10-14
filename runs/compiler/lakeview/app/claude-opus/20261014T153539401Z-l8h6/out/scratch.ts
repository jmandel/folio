import { transform } from "./transform.ts";
const it = (id:string, recorded:string, payload:any, extra:any={}) => ({folio:"0.1",id,issuer:"x",patient:"p",effective:recorded,recorded,narrative:"",payload,...extra});
const items:any[] = [
 it("L1","2022-03-13T10:00:00-05:00",{req:{type:"LAB_REQ",REQ_ID:"R1",COLLECTED_AT:"2022-03-13T03:30:00-05:00"},
   o1:{type:"LAB_ORDER",ORDER_ID:"O1",ORDER_STATUS:4},o2:{type:"LAB_ORDER",ORDER_ID:"O2",ORDER_STATUS:9},
   r1:{type:"LAB_RESULT",RESULT_ID:"A",ORDER_ID:"O1",TEST_CODE:"LK-EGFR21",VALUE_TEXT:">90",VALUE_NUM:9999999,UNIT_CODE:"mL/min/1.73m2",RESULT_STATUS:"P"},
   r2:{type:"LAB_RESULT",RESULT_ID:"B",ORDER_ID:"O2",TEST_CODE:"LK-K",VALUE_TEXT:"4.1",VALUE_NUM:4.1,UNIT_CODE:"mmol/L",RESULT_STATUS:"F"},
   r3:{type:"LAB_RESULT",RESULT_ID:"C",ORDER_ID:"O1",TEST_CODE:"LK-PLT",VALUE_TEXT:"212",VALUE_NUM:212,UNIT_CODE:"K/uL",RESULT_STATUS:"A"}}),
 it("V1","2022-01-01T10:00:00-06:00",{v:{type:"CLINIC_VISIT",VISIT_ID:"V1",VISIT_AT:"2022-01-01T09:00:00-06:00"},
   d1:{type:"VISIT_DX",VISIT_ID:"V1",DX_RANK:1,ICD10CM:"E87.5",DX_TEXT:"Hyperkalemia",DX_STATUS:"A"},
   d2:{type:"VISIT_DX",VISIT_ID:"V1",DX_RANK:2,ICD10CM:"T46.4X5A",DX_TEXT:"Adverse effect of angiotensin-converting-enzyme inhibitors, initial encounter",DX_STATUS:"A"},
   d3:{type:"VISIT_DX",VISIT_ID:"V1",DX_RANK:3,ICD10CM:"N04.9",DX_TEXT:"Nephrotic syndrome",DX_STATUS:"P"},
   m1:{type:"MED_ORDER",RX_ID:"RX1",VISIT_ID:"V1",DRUG_NAME:"lisinopril 20 mg tablet",DOSE_QTY:20,DOSE_UNIT:"mg",FREQ_CODE:"QD",MED_STATUS:1,START_DATE:"2021-05-01"},
   m2:{type:"MED_ORDER",RX_ID:"RX2",VISIT_ID:"V1",DRUG_NAME:"losartan potassium 50 mg tablet",DOSE_QTY:50,DOSE_UNIT:"mg",FREQ_CODE:"QD",MED_STATUS:1,START_DATE:"2022-01-02"},
   m3:{type:"MED_ORDER",RX_ID:"RX3",VISIT_ID:"V1",DRUG_NAME:"sodium bicarbonate 650 mg tablet",DOSE_QTY:1300,DOSE_UNIT:"mg",FREQ_CODE:"BID",MED_STATUS:1,START_DATE:"2022-01-02"}}),
 it("V2","2022-02-01T10:00:00-06:00",{v:{type:"CLINIC_VISIT",VISIT_ID:"V2",VISIT_AT:"2022-02-01T09:00:00-06:00"},
   h:{type:"MED_STATUS_HIST",HIST_ID:"H1",VISIT_ID:"V2",RX_ID:"RX1",OLD_STATUS:1,NEW_STATUS:2,CHANGED_AT:"2022-02-01T09:10:00-06:00",REASON_CODE:"ADR",COMMENT_TEXT:"hyperK"},
   h2:{type:"MED_STATUS_HIST",HIST_ID:"H2",VISIT_ID:"V2",RX_ID:"RX3",OLD_STATUS:1,NEW_STATUS:9,CHANGED_AT:"2022-02-01T09:10:00-06:00",REASON_CODE:"ERR"}}),
 it("V3","2022-02-02T10:00:00-06:00",{}, {retracts:["V2"]}),
];
console.log(JSON.stringify(transform(items,"2022-03-13"),null,1));
console.log(JSON.stringify(transform(items,"2022-02-01").medications.map(m=>[m.ingredient,m.status,m.stop_reason])));
