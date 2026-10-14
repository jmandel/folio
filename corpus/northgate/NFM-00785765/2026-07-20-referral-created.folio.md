---
folio: "0.1"
id: "01KXZX0630E4WKSYR9VX8PYB00"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2026-07-20T08:55:00-05:00"
recorded: "2026-07-20T08:56:12-05:00"
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

<ref id="referral">I am referring this pt for CKD evaluation and management. Latest labs show eGFR 43 and UACR 33 mg/g.</ref>

Pt has CKD stage 3a along with type 2 diabetes and essential hypertension. Kidney function has drifted down over the past couple of years. Metformin was reduced today for the lower eGFR.

Please see and advise on further workup and management. Thank you.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-1353",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 33 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1353",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1353",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1353",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
