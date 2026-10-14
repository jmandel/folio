---
folio: "0.1"
id: "01KFPFQ7W0VDQG3SCSYXYM7TB6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2026-01-23T16:30:00-06:00"
recorded: "2026-01-23T16:31:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

<ref id="referral">I am referring this patient for evaluation and management of chronic kidney disease; eGFR today is 48 with UACR 276 mg/g.</ref>

The patient has chronic kidney disease stage 3a, type 2 diabetes mellitus and essential hypertension. Kidney function has declined gradually over the past year. I would appreciate your assessment and recommendations on further workup and management.

Thank you for seeing them.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-1701",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 48, UACR 276 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1701",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1701",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1701",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
