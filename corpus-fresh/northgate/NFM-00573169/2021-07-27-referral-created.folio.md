---
folio: "0.1"
id: "01FBM9QWF0GJ9TBE9RYJ4KDHF8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00573169"
effective: "2021-07-27T10:35:00-05:00"
recorded: "2021-07-27T10:36:12-05:00"
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

Thank you for seeing this pt with stage 3b CKD, type 2 diabetes and essential hypertension, followed here for several years. <ref id="referral">Most recent eGFR 45 and UACR 77 mg/g; referring for CKD evaluation and management.</ref>

Kidney function has been stable in the 40s but albuminuria persists. BP was 140/81 at today's visit. Please advise on workup and any changes you would recommend. Recent labs are available on request.

Thank you for your help.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1838",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 45, UACR 77 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1838",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1838",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1838",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
