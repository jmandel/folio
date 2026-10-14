---
folio: "0.1"
id: "01FC3R46F0JD128JPS1WPT24S2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00573169"
effective: "2021-08-02T10:35:00-05:00"
recorded: "2021-08-02T10:36:12-05:00"
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
    "referral_id": "RF-2021-1838",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 45, UACR 77 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2021-09-27"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1838",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1838",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1838",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
