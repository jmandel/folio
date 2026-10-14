---
folio: "0.1"
id: "01K5YGR990Z633A6A7DC8FS8Z1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00437946"
effective: "2025-09-24T13:45:00-05:00"
recorded: "2025-09-24T13:46:12-05:00"
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

Thank you for seeing this patient with CKD stage 3a, type 2 diabetes and essential hypertension, followed here in primary care. <ref id="referral">eGFR 55 and UACR 153 mg/g; we are asking for CKD evaluation and management.</ref>

Kidney function has been fairly steady, but the albuminuria has been rising over the past few visits. Blood pressure has run above goal at several visits. Please advise on further workup and on how to protect kidney function going forward. Recent labs can be sent on request.

Thank you,
Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-0641",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 55, UACR 153 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0641",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0641",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0641",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
