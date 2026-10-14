---
folio: "0.1"
id: "01GHM3MWX0VQ9GF299A9JV9EAP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2022-11-11T13:45:00-06:00"
recorded: "2022-11-11T13:46:12-06:00"
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

Thank you for seeing this patient with type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 66 and UACR 276 mg/g; please evaluate and help manage CKD.</ref>

Albuminuria has persisted over several visits while BP has been mostly at goal. Chronic kidney disease is on the problem list. Recent labs and visit notes are available in the chart.

Please send your recommendations after the visit. Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1405",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 66, UACR 276 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1405",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1405",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1405",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
