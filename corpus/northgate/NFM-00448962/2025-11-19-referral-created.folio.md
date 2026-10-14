---
folio: "0.1"
id: "01KAEM4ZK0CYH0FJMBHAEJJV9F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00448962"
effective: "2025-11-19T11:55:00-06:00"
recorded: "2025-11-19T11:56:12-06:00"
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

Thank you for seeing this pt with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR is 51 with UACR 207 mg/g; I am asking for CKD evaluation and management.</ref>

Kidney function has drifted down over the past year and the albuminuria has persisted. Pt is aware of the referral and agrees to be seen. Recent labs and my notes are available on request.

Please call with any questions. Thank you for your help with this pt's care.

Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-0888",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 51, UACR 207 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0888",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0888",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0888",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
