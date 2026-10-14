---
folio: "0.1"
id: "01HVPBSBD0XX2DCBWHPWPFTKZ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00698984"
effective: "2024-04-17T10:45:00-05:00"
recorded: "2024-04-17T10:46:12-05:00"
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

<ref id="referral">Referring this pt for CKD evaluation and management. eGFR 57 and UACR 375 mg/g.</ref>

Pt has type 2 diabetes and essential hypertension. Seen here for the first time on 4/17 to establish care, and the kidney findings were noted at that visit. We would appreciate your help with the work-up and with ongoing kidney management, and we are glad to share any records you need.

Thank you for seeing this pt.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0166",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 57, UACR 375 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0166",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0166",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0166",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
