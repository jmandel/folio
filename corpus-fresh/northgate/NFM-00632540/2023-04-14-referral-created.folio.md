---
folio: "0.1"
id: "01GY0M0400NGMYHJJ2525DN8J3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00632540"
effective: "2023-04-14T14:30:00-05:00"
recorded: "2023-04-14T14:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care colleagues,

Thank you for seeing this patient with chronic kidney disease stage 3a and type 2 diabetes mellitus. Most recent labs show <ref id="referral">eGFR 47 and UACR 14 mg/g. Requesting CKD evaluation and management.</ref>

Kidney function has been stable in the high 40s over the last few years, with BP at goal today. We would appreciate your recommendations on further workup and any changes to the plan. Recent notes and labs are available on request.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0550",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 47, UACR 14 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0550",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0550",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
