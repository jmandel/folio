---
folio: "0.1"
id: "01FDATZ1V0HBF183FAJ22YHXXH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00985366"
effective: "2021-08-17T14:55:00-05:00"
recorded: "2021-08-17T14:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care colleagues,

Thank you for seeing this patient, who is establishing care with me. Their history includes type 2 diabetes and essential hypertension. <ref id="referral">Labs today show eGFR 42 and UACR 131 mg/g; I am asking for CKD evaluation and management.</ref>

Metformin was adjusted today for the eGFR. Please advise on further workup and on anything we should do in primary care to protect kidney function. I will continue to see the patient for diabetes and blood pressure.

Thank you,
Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1088",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 42, UACR 131 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1088",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1088",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1088",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
