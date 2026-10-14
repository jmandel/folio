---
folio: "0.1"
id: "01FJ9X9NV0TK114V5VQ4109TXX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2021-10-18T09:35:00-05:00"
recorded: "2021-10-18T09:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this patient with chronic kidney disease and type 2 diabetes mellitus. <ref id="referral">Most recent eGFR is 70 with UACR 355 mg/g. I am asking for CKD evaluation and management.</ref>

BP today was 121/73. Potassium 4.2 and A1c 8.2% today. Please send your recommendations and I will continue to follow the pt here for routine diabetes care.

Thank you,
Jaya Patel, NP
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0720",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 70, UACR 355 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0720",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0720",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  }
}
```
