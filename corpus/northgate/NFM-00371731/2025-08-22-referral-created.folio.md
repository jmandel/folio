---
folio: "0.1"
id: "01K394FDQ0ZV2Q08MZ0YWN2V31"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00371731"
effective: "2025-08-22T09:55:00-05:00"
recorded: "2025-08-22T09:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this pt with CKD stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 57 and UACR 299 mg/g; please evaluate and manage CKD.</ref>

BP has been in range at recent visits and A1c is stable. Labs and medication list are available in our record. Please call with any questions.

Thank you for your help with this pt's care.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-0945",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 57, UACR 299 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0945",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0945",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0945",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
