---
folio: "0.1"
id: "01HJ70X7N0VJW431K23NTA7H07"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00786279"
effective: "2023-12-21T14:25:00-06:00"
recorded: "2023-12-21T14:26:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

<ref id="referral">Referring for CKD evaluation and management: eGFR 40 and UACR 251 mg/g.</ref>

Pt has type 2 diabetes and essential hypertension. I saw this pt today to establish care. Please see and advise on workup and ongoing management. I will continue primary care in the meantime and can send labs or records on request.

Thank you for seeing this pt.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0159",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 40, UACR 251 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0159",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0159",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0159",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
