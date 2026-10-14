---
folio: "0.1"
id: "01FR3K2CV0D7QR45B4JW4F2BKQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00996346"
effective: "2021-12-29T11:15:00-06:00"
recorded: "2021-12-29T11:16:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleagues at Lakeview Kidney Care,

Thank you for seeing this patient with type 2 diabetes and essential hypertension. <ref id="referral">Today eGFR is 65 and UACR is 267 mg/g. I would appreciate your evaluation and management of chronic kidney disease.</ref>

The patient is otherwise stable and follows with me regularly. Please send your recommendations when you have seen them.

Thank you,
Moira Brennan, DO

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1930",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 65, UACR 267 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1930",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1930",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1930",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
