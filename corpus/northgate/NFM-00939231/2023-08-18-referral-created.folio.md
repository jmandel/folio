---
folio: "0.1"
id: "01H852Y4X0C870GCQTD0PEM4DB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2023-08-18T14:45:00-05:00"
recorded: "2023-08-18T14:46:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="referral">Referral to Lakeview Kidney Care: eGFR 39, UACR 394 mg/g: CKD evaluation and management</ref>

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1504",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 39, UACR 394 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1504",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1504",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1504",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
