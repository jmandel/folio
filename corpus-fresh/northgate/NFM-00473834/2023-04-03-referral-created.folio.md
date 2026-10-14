---
folio: "0.1"
id: "01GX47M470V3HF9DT7JTFEB1S7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00473834"
effective: "2023-04-03T13:55:00-05:00"
recorded: "2023-04-03T13:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. at Lakeview Kidney Care,

<ref id="referral">I am referring this pt for CKD evaluation and management. Most recent eGFR is 62 with UACR 263 mg/g.</ref>

Pt has type 2 diabetes and essential hypertension, both followed here. Please see and advise on kidney care. Recent labs are available on request.

Thank you for seeing this pt.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1303",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 62, UACR 263 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1303",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1303",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1303",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
