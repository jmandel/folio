---
folio: "0.1"
id: "01FKGH8EV028N6R9S1G4YA5DAV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2021-11-02T09:35:00-05:00"
recorded: "2021-11-02T09:36:12-05:00"
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
    "referral_id": "RF-2021-0953",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 47, UACR 446 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2021-12-03"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0953",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0953",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0953",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
