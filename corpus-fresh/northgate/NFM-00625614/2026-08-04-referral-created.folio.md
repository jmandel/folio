---
folio: "0.1"
id: "01KZ744C00A4E98ME5EQJEKVDA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625614"
effective: "2026-08-04T14:30:00-05:00"
recorded: "2026-08-04T14:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

<ref id="referral">Thank you for seeing this pt for CKD evaluation and management. Most recent eGFR 41 with UACR 40 mg/g.</ref>

Pt has stage 3a chronic kidney disease along with type 2 diabetes and essential hypertension. Kidney function has drifted down over the past couple of years. Pt feels well and has no new urinary symptoms. Recent labs and our visit notes are available on request.

Please send your recommendations after the visit. Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-1464",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 41, UACR 40 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1464",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1464",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1464",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
