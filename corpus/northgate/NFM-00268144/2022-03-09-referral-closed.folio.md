---
folio: "0.1"
id: "01FXQT17Y0TFHD3DWB5EHRS6E0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00268144"
effective: "2022-03-09T11:00:00-06:00"
recorded: "2022-03-09T11:01:12-06:00"
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
    "referral_id": "RF-2021-1068",
    "action": "closed",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 702 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1068",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1068",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1068",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
