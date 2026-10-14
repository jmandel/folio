---
folio: "0.1"
id: "01GSTKKQD0KJ0HCWR91HX8VQ9A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696822"
effective: "2023-02-21T12:25:00-06:00"
recorded: "2023-02-21T12:26:12-06:00"
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

Thank you for seeing this patient, who established care with us today. They have type 2 diabetes and essential hypertension.

<ref id="referral">Labs today show eGFR 44 and UACR 7 mg/g. I am referring for CKD evaluation and management.</ref>

Please see the visit labs and problem list for the rest of the history. I would appreciate your recommendations on workup and ongoing kidney care, and we will continue to manage the diabetes and blood pressure here in the meantime.

Thank you,
Jaya Patel, NP
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-1747",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 44, UACR 7 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1747",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1747",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-1747",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
