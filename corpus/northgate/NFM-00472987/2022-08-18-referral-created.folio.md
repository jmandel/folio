---
folio: "0.1"
id: "01GASDJX907QEY8B0JF6HHAC52"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00472987"
effective: "2022-08-18T16:25:00-05:00"
recorded: "2022-08-18T16:26:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this pt, who established care with me today. He has type 2 diabetes and essential hypertension, and has chronic kidney disease on his problem list.

<ref id="referral">Referring for CKD evaluation and management: eGFR 45, UACR 12 mg/g.</ref>

Please advise on workup and on anything we should change in his diabetes or BP regimen given his kidney function. I will continue to follow his diabetes and BP here and will send recent labs on request.

Thank you for your help.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1132",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 45, UACR 12 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1132",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1132",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1132",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
