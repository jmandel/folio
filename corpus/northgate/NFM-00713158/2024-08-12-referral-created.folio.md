---
folio: "0.1"
id: "01J53T9PR0Q06RSE8KKV8KNM4S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00713158"
effective: "2024-08-12T12:30:00-05:00"
recorded: "2024-08-12T12:31:12-05:00"
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

Thank you for seeing this pt with type 2 diabetes and chronic kidney disease stage 3a. <ref id="referral">Most recent labs show eGFR 48 and UACR 106 mg/g; I am asking for CKD evaluation and management.</ref>

Kidney function has been slowly declining over the past couple of years and albuminuria has risen. BP is well controlled in clinic. Recent notes and labs are available on request.

Please send your recommendations when you have seen the pt. Thank you for your help.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2024-0948",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 48, UACR 106 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0948",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0948",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
