---
folio: "0.1"
id: "01KR1Z1HZ0C24CKZ0TVQKJGQDC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877608"
effective: "2026-05-07T14:35:00-05:00"
recorded: "2026-05-07T14:36:12-05:00"
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

<ref id="referral">I am referring this patient for CKD evaluation and management. Today eGFR is 45 with UACR 181 mg/g.</ref> The patient has stage 3a chronic kidney disease, type 2 diabetes and essential hypertension. Kidney function has been drifting down over the past year or so. A1c today is 7.1% and K 4.5.

Thank you for seeing them. Please send your recommendations to our office.

Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0770",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 45, UACR 181 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0770",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0770",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0770",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
