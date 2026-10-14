---
folio: "0.1"
id: "01KBDDRWY0EVC9KRXEFHYE4EVC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2025-12-01T11:00:00-06:00"
recorded: "2025-12-01T11:01:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

Thank you for seeing this pt with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Latest eGFR is 43 and UACR 314 mg/g; we are asking for CKD evaluation and management.</ref>

Kidney function has been drifting down over the past few years while albuminuria has risen. BP is at goal on recent visits. Please see recent labs in the chart. Let us know your recommendations and we will carry them out here.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-1388",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 314 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1388",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1388",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1388",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
