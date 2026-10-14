---
folio: "0.1"
id: "01FXB2AZF03K2XKMJ3NYEPHXHT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00171449"
effective: "2022-03-04T12:15:00-06:00"
recorded: "2022-03-04T12:16:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. Lakeview Kidney Care team,

I am referring a new patient of our practice with type 2 diabetes and essential hypertension who has chronic kidney disease.

<ref id="referral">Labs today show eGFR 56 and UACR 424 mg/g. We would appreciate your evaluation and management of the CKD.</ref>

The patient is otherwise stable and has no acute complaints. Please send your recommendations to our office and let us know if you need further records.

Thank you for seeing this patient.

Jaya Patel, NP
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1874",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 56, UACR 424 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1874",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1874",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1874",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
