---
folio: "0.1"
id: "01H8SN8E00R3FXQA9YBY64GFTJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2023-08-26T14:30:00-05:00"
recorded: "2023-08-26T14:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:nortiz"
  name: "Nina Ortiz, RN"
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
    "referral_id": "RF-2023-0790",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 59, UACR 311 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2023-09-27"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0790",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0790",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
