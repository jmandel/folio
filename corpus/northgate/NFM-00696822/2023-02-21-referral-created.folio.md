---
folio: "0.1"
id: "01GSTKKQD0P44SY6YQSAD8Q61Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696822"
effective: "2023-02-21T12:25:00-06:00"
recorded: "2023-02-21T12:26:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="referral">Referral to Lakeview Kidney Care: eGFR 44, UACR 7 mg/g: CKD evaluation and management</ref>

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0965",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 44, UACR 7 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0965",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0965",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0965",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
