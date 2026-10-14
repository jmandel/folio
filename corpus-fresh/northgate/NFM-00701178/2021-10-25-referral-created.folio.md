---
folio: "0.1"
id: "01FJW4C450HADFPRCM3MEZFF5J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701178"
effective: "2021-10-25T11:25:00-05:00"
recorded: "2021-10-25T11:26:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleagues,

<ref id="referral">Thank you for seeing this pt for CKD evaluation and management. Most recent eGFR 71 with UACR 247 mg/g.</ref>

He has type 2 diabetes and essential hypertension, both followed here for several years. BP and A1c have been fairly steady on current therapy, but the albuminuria has persisted despite that. We would value your opinion on work-up and on how best to protect kidney function going forward.

Recent labs are available on request. Please send your recommendations to our office.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0904",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 71, UACR 247 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0904",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0904",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0904",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
