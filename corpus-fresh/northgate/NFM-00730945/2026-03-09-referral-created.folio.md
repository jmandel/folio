---
folio: "0.1"
id: "01KK9HJEQ0RXHR3C49N2TDYDHV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2026-03-09T09:55:00-05:00"
recorded: "2026-03-09T09:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this patient with CKD stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR is 50 with UACR 22 mg/g; I am asking for CKD evaluation and management.</ref>

Kidney function has been fairly stable over the past few years, but the urine albumin has drifted up. Please advise on any further workup and on how best to protect renal function. I am happy to continue diabetes and BP care here.

Thank you,
Daniel Khan, MD

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-1171",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 22 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1171",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1171",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1171",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
