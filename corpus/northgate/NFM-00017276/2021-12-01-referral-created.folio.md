---
folio: "0.1"
id: "01FNV8G7N036TY0P1PGVAKPE4T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00017276"
effective: "2021-12-01T09:05:00-06:00"
recorded: "2021-12-01T09:06:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="referral">Referral to Lakeview Kidney Care: eGFR 38, UACR 288 mg/g: CKD evaluation and management</ref>

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1360",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 38, UACR 288 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1360",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1360",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1360",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
