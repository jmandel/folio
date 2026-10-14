---
folio: "0.1"
id: "01FH0MMY308KYTP08GPTQ2PD5E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00748302"
effective: "2021-10-02T08:55:00-05:00"
recorded: "2021-10-02T08:56:12-05:00"
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
    "referral_id": "RF-2021-1685",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 68, UACR 292 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2021-11-17"
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
