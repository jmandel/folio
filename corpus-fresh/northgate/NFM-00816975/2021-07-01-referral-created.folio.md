---
folio: "0.1"
id: "01F9H7P5W0K2S1F877GZKR8MPT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2021-07-01T09:30:00-05:00"
recorded: "2021-07-01T09:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this pt with chronic kidney disease, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 67, UACR 492 mg/g. Requesting CKD evaluation and management.</ref>

Pt has been followed here for several years with persistent albuminuria. Please send your recommendations and I will continue primary care follow-up.

Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1600",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 67, UACR 492 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1600",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1600",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1600",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
