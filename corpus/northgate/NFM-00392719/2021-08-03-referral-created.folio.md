---
folio: "0.1"
id: "01FC66GQX0A70EH7BAEC4YKXEE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2021-08-03T09:25:00-05:00"
recorded: "2021-08-03T09:26:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="referral">Referral to Lakeview Kidney Care: eGFR 43, UACR 248 mg/g: CKD evaluation and management</ref>

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1322",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 248 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1322",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1322",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1322",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
