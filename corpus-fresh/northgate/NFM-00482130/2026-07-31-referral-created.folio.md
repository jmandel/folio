---
folio: "0.1"
id: "01KYWEGZA0P183C15ZV0RJRSJ1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2026-07-31T11:00:00-05:00"
recorded: "2026-07-31T11:01:12-05:00"
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

Thank you for seeing this patient of mine with CKD stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">eGFR 43, UACR 29 mg/g: please evaluate and help manage CKD.</ref>

Kidney function has been slowly declining over the past couple of years, and albuminuria is now present. BP and diabetes are being followed here. Please let me know if you need further records or labs.

Thank you,
Daniel Khan, MD

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2026-0561",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 29 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0561",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0561",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0561",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
