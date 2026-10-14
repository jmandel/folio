---
folio: "0.1"
id: "01KHM0CNV0M0RM9C7EVRFFDH3V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2026-02-16T13:55:00-06:00"
recorded: "2026-02-16T13:56:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. Lakeview Kidney Care colleague,

Thank you for seeing this patient with type 2 diabetes and essential hypertension. They have chronic kidney disease stage 3a that has been slowly progressing over the past year.

<ref id="referral">Referral for CKD evaluation and management: eGFR 47 and UACR 217 mg/g.</ref>

BP is controlled in clinic at 121/73. Recent labs and visit notes are available in the shared record. Please advise on workup and further management, and let us know if you need anything else from our chart.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-1793",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 47, UACR 217 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1793",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1793",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1793",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
