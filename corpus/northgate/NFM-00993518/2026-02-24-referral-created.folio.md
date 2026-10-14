---
folio: "0.1"
id: "01KJ8EZYB0796KTZEPEDMYQY3Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00993518"
effective: "2026-02-24T12:35:00-06:00"
recorded: "2026-02-24T12:36:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this pt with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR is 50 with UACR 27 mg/g; I am asking for CKD evaluation and management.</ref>

Renal function has drifted down gradually over the past few visits. Diabetes and BP are being followed here. Please send your recommendations after the visit and let me know if you need any further records.

Sincerely,
Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-1384",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 27 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1384",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1384",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1384",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
