---
folio: "0.1"
id: "01J9KQ3TS0YQJCAJR9HB8VBX23"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084998"
effective: "2024-10-07T09:45:00-05:00"
recorded: "2024-10-07T09:46:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

<ref id="referral">Referring this pt for CKD evaluation and management. eGFR 42, UACR 7 mg/g.</ref>

Pt has type 2 diabetes and essential hypertension, and I saw them today as a new patient to establish care. I would appreciate your help with workup and with long-term kidney management. Please send recommendations to our office, and call if you need anything further from the chart.

Thank you for seeing them.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-1054",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 42, UACR 7 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1054",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1054",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1054",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
