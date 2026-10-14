---
folio: "0.1"
id: "01JJW9DD60WBEQC2W0R9S5DWWX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493958"
effective: "2025-01-30T13:00:00-06:00"
recorded: "2025-01-30T13:01:12-06:00"
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

Thank you for seeing this pt with stage 3a CKD, type 2 diabetes and essential hypertension. <ref id="referral">eGFR 44 and UACR 136 mg/g; please evaluate and help manage CKD.</ref>

BP is at goal and A1c 7.5% on recent labs. Metformin was reduced to 500 mg BID today for the eGFR. Recent labs are available on request.

Thank you for your help with this pt's care.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-0915",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 44, UACR 136 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0915",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0915",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0915",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
