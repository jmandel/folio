---
folio: "0.1"
id: "01FWHC2Q90KKA51THV9F29Z6QT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00520269"
effective: "2022-02-22T12:45:00-06:00"
recorded: "2022-02-22T12:46:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. at Lakeview Kidney Care,

Thank you for seeing this patient with type 2 diabetes and chronic kidney disease stage 3a. <ref id="referral">eGFR 46, UACR 639 mg/g: please evaluate and help manage CKD.</ref>

Kidney function has been slowly declining over the past couple of years while albuminuria has increased. BP has been at goal in the office. I would appreciate your recommendations on further workup and management, and I will continue to follow the diabetes here.

Recent labs are available in the chart. Please call with any questions.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-0486",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 46, UACR 639 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0486",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0486",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
