---
folio: "0.1"
id: "01HMW75TW09BXYY4JJCKW335HZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00920167"
effective: "2024-01-23T16:30:00-06:00"
recorded: "2024-01-23T16:31:12-06:00"
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

Thank you for seeing this pt with chronic kidney disease, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 62 and UACR 379 mg/g; requesting CKD evaluation and management.</ref>

BP has been at goal at recent visits, 131/70 today. Please send your recommendations after the visit and I will continue to follow the pt here.

Thank you,
Daniel Khan, MD

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0474",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 62, UACR 379 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0474",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0474",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0474",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
