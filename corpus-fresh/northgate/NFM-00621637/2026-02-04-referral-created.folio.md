---
folio: "0.1"
id: "01KGN86HB0XA77CJR354ZEK9K8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00621637"
effective: "2026-02-04T15:15:00-06:00"
recorded: "2026-02-04T15:16:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. Lakeview Kidney Care colleague,

<ref id="referral">Thank you for seeing this pt for CKD evaluation and management. eGFR 43 today, UACR 173 mg/g.</ref>

Pt has chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. Kidney function has declined gradually over the past year. Metformin was reduced today for the eGFR. Please advise on further workup and management.

Thank you,
Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0430",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 173 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0430",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0430",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0430",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
