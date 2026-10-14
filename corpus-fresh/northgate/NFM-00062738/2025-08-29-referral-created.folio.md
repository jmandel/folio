---
folio: "0.1"
id: "01K3VTDYD0BJWFAN8T66T0R9D2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00062738"
effective: "2025-08-29T16:05:00-05:00"
recorded: "2025-08-29T16:06:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this patient of mine with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR is 44 and UACR 248 mg/g; I am asking for CKD evaluation and management.</ref> Kidney function has been drifting down over the past couple of years while albuminuria has increased.

Please advise on further workup and any changes you would recommend. I am happy to continue routine diabetes and BP care here in the meantime.

Thank you,
Teresa Reyes, MD

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-1983",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 44, UACR 248 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1983",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1983",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1983",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
