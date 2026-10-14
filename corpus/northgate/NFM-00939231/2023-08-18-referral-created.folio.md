---
folio: "0.1"
id: "01H852Y4X0T2Y9P82AG5B3RGZ5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2023-08-18T14:45:00-05:00"
recorded: "2023-08-18T14:46:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. Lakeview Kidney Care team,

Thank you for seeing this pt, who established care with me today. <ref id="referral">eGFR 39 and UACR 394 mg/g; requesting evaluation and management of CKD.</ref>

Pt has type 2 diabetes and essential hypertension, both by history. BP was above goal in the office today. Labs from this week are available in the chart.

Please let me know if you need anything else before the visit. I would appreciate your recommendations and a copy of your note.

Thank you,
Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1653",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 39, UACR 394 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1653",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1653",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1653",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
