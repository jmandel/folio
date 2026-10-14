---
folio: "0.1"
id: "01KJG0EZZ005S8PAHX3AWV8MWE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2026-02-27T10:55:00-06:00"
recorded: "2026-02-27T10:56:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care colleagues,

Thank you for seeing this patient with type 2 diabetes and essential hypertension, who now has chronic kidney disease stage 3b. <ref id="referral">eGFR was 44 and UACR 257 mg/g today, and I am asking for CKD evaluation and management.</ref>

Kidney function has declined gradually over the past couple of years, with albuminuria rising over the same period. The patient feels well. Recent labs and our visit notes are available in the shared record.

Please call with any questions. Thank you for your help with their care.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0642",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 44, UACR 257 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0642",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0642",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0642",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
