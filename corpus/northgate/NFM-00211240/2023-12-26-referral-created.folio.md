---
folio: "0.1"
id: "01HJKMWFH0ZC9KXQ5Q8ET2XSB7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00211240"
effective: "2023-12-26T12:05:00-06:00"
recorded: "2023-12-26T12:06:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

I am referring a new patient to my practice for nephrology evaluation. <ref id="referral">eGFR 38 and UACR 59 mg/g: please evaluate and help manage CKD.</ref>

The patient also has essential hypertension. I saw them today to establish care, and I would appreciate your assessment of the cause and stage of the kidney disease and your recommendations for ongoing management. I am happy to continue blood pressure follow-up here and to coordinate with you.

Thank you for seeing them. Please send your notes to our office.

Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1965",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 38, UACR 59 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1965",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1965",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
