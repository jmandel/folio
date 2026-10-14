---
folio: "0.1"
id: "01KM3Y4TF0QXNNA3SCMJGP0AHM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2026-03-19T15:55:00-05:00"
recorded: "2026-03-19T15:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleagues at Lakeview Kidney Care,

Thank you for seeing this patient with CKD stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Today eGFR is 46 with UACR 31 mg/g, and I would appreciate your evaluation and management of the CKD.</ref>

eGFR has drifted down over the past couple of years. BP today was 129/78 and A1c 7.8%. Please send your recommendations and I will continue to follow in primary care.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0655",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 46, UACR 31 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0655",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0655",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0655",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
