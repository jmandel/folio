---
folio: "0.1"
id: "01GCEX1RB0FRGZQV60BA97H5RC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00721565"
effective: "2022-09-08T10:55:00-05:00"
recorded: "2022-09-08T10:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care colleague,

I am referring a patient I just met, who has type 2 diabetes and hypertension. <ref id="referral">Labs today show eGFR 40 and UACR 80 mg/g. Please evaluate and help manage CKD.</ref>

Potassium is 4.7 and A1c is 7.7%. BP was 146/88 at the visit. Recent labs are available on request.

Thank you for seeing them.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1730",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 40, UACR 80 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1730",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1730",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1730",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
