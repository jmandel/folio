---
folio: "0.1"
id: "01G5KWD0W06Y7NKH2NQKQSP2KM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620040"
effective: "2022-06-15T09:30:00-05:00"
recorded: "2022-06-15T09:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Nephrology colleagues,

Thank you for seeing this patient, who established care with me today. They have type 2 diabetes and essential hypertension, and labs today show reduced kidney function with albuminuria.

<ref id="referral">eGFR 38, UACR 148 mg/g. Requesting evaluation and management of CKD.</ref>

I would appreciate your recommendations on workup and on slowing progression, given the diabetes and blood pressure history. Records from today's visit are available on request. Please call with any questions.

Thank you,
Dr. Reyes

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1621",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 38, UACR 148 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1621",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1621",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1621",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
