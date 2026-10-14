---
folio: "0.1"
id: "01FGPB2230J34QV40B8HXW7M65"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00748302"
effective: "2021-09-28T08:55:00-05:00"
recorded: "2021-09-28T08:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this pt with type 2 diabetes and essential hypertension. <ref id="referral">eGFR 68 and UACR 292 mg/g; requesting CKD evaluation and management.</ref>

The albuminuria has been persistent on repeat testing. BP has been above goal and we adjusted therapy today. Recent labs are available in the chart. Please send your recommendations and I will continue to follow BP and diabetes here.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1685",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 68, UACR 292 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1685",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1685",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1685",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
