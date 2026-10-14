---
folio: "0.1"
id: "01KESGF05097B9S339EW6FN9W4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00158160"
effective: "2026-01-12T10:25:00-06:00"
recorded: "2026-01-12T10:26:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. colleague at Lakeview Kidney Care,

Thank you for seeing this pt with stage 3a CKD, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 47 with UACR 20 mg/g; referred for CKD evaluation and management.</ref>

Kidney function has been stable in the 40s over the past couple of years. BP is currently at goal. Please advise on further workup and any changes you would recommend to the plan. I am happy to continue routine diabetes and BP care here in the meantime.

Thank you for your help.

Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0764",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 47, UACR 20 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0764",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0764",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0764",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
