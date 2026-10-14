---
folio: "0.1"
id: "01KRY1ZDS0GDSMR9X43K4T4Z5P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00347581"
effective: "2026-05-18T12:25:00-05:00"
recorded: "2026-05-18T12:26:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this pt with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">eGFR 43 and UACR 46 mg/g, referred for CKD evaluation and management.</ref>

Renal function has been drifting down over the past year or so. We adjusted metformin today for the eGFR. Please advise on further workup and ongoing management.

Thank you,
Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-1628",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 46 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1628",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1628",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1628",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
