---
folio: "0.1"
id: "01HSK6JY50Z67G28Q9GVXA1ATR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00335470"
effective: "2024-03-22T08:45:00-05:00"
recorded: "2024-03-22T08:46:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this pt with chronic kidney disease, type 2 diabetes mellitus and essential hypertension. <ref id="referral">Labs today show eGFR 59 and UACR 288 mg/g; I would appreciate your evaluation and management of the CKD.</ref>

Recent notes and results are available in the chart. Please send your recommendations to our office, and we will continue to see the pt for primary care and diabetes follow-up.

Thank you for your help.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0230",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 59, UACR 288 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0230",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0230",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0230",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
