---
folio: "0.1"
id: "01HEJTQ9S045ZRZ4TBAM435JJV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2023-11-06T11:25:00-06:00"
recorded: "2023-11-06T11:26:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. at Lakeview Kidney Care,

Thank you for seeing this pt with Type 2 diabetes, essential hypertension and chronic kidney disease stage 3a. <ref id="referral">Most recent eGFR is 43 with UACR 101 mg/g, and I would appreciate your evaluation and management of the CKD.</ref>

BP and diabetes are being followed here. Please send your recommendations after the visit and call with any questions.

Thank you,
Jaya Patel, NP
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0351",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 101 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0351",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0351",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0351",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
