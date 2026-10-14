---
folio: "0.1"
id: "01HA2S1H90VR7NRMZFT4JXWKBD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00394631"
effective: "2023-09-11T13:45:00-05:00"
recorded: "2023-09-11T13:46:12-05:00"
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
    "referral_id": "RF-2023-0382",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 229 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2023-10-26"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0382",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0382",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
