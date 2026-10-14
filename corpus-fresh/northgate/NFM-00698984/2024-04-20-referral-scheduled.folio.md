---
folio: "0.1"
id: "01HVY2ZGD0N5FPJHRV2CY87DEJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00698984"
effective: "2024-04-20T10:45:00-05:00"
recorded: "2024-04-20T10:46:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:kfoster"
  name: "Kim Foster, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0166",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 57, UACR 375 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2024-05-29"
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
