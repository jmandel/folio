---
folio: "0.1"
id: "01HAZB4ME0KRTZ5ZZHPM425KTM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00359511"
effective: "2023-09-22T16:00:00-05:00"
recorded: "2023-09-22T16:01:12-05:00"
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

Thank you for seeing this patient, a new patient to our practice with chronic kidney disease, type 2 diabetes and essential hypertension. <ref id="referral">eGFR 42 and UACR 499 mg/g. Please evaluate and help manage CKD.</ref>

Labs and visit notes from today are available on request. We will continue primary care follow-up in the meantime and appreciate any recommendations you have.

Thank you,
Jaya Patel, NP
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0344",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 42, UACR 499 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0344",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0344",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0344",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
