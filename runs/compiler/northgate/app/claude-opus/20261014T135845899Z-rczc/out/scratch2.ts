import { transform } from "./transform.ts";
const r = (o:any)=>({type:"imported_result",result_status:"F",collected:"2025-01-02T23:30:00-06:00",resulted:"x",unit:"mL/min/1.73m2",...o});
const items:any[] = [
 {id:"A",issuer:"i",effective:"2025-01-02T23:30:00-06:00",recorded:"2025-01-03T05:10:00Z",narrative:"",payload:{
  e1:r({test:{nfm_code:"EGFR-NAA",name:"eGFR (non-African American)",loinc:"48642-3"},value:">60",comment:"Calculated by CKD-EPI 2009.",external_ref:{accession:"X",result_code:"LK-EGFR09N"}}),
  e2:r({test:{nfm_code:"EGFR-AA",name:"eGFR (African American)",loinc:"48643-1"},value:">60",comment:"Calculated by CKD-EPI 2009.",external_ref:{accession:"X",result_code:"LK-EGFR09A"}}),
  e3:r({test:{nfm_code:"EGFR",name:"eGFR CKD-EPI 2021"},value:"58",external_ref:{accession:"X",result_code:"LK-EGFR21"}}),
  g:r({test:{nfm_code:"GLU",name:"Glucose, serum",loinc:"2345-7"},value:"Hemolyzed",unit:"mg/dL",flag:"A",external_ref:{accession:"X",result_code:"LK-GLU"}}),
  u:r({test:{nfm_code:"UCREAT",name:"Creatinine, urine"},value:"80",unit:"mg/dL",external_ref:{accession:"X",result_code:"LK-UCR"}}),
  v:{type:"vital_set",bp:"120/80"}}},
];
for (const d of ["2025-01-02","2025-01-03"]) console.log(d, JSON.stringify(transform(items, d)));
