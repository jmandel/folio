---
folio: "0.1"
id: "01FH8PDTY0NQ7K4QZYQHVTBZ9X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2021-10-05T12:00:00-05:00"
recorded: "2021-10-05T12:01:12-05:00"
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

Thank you for seeing this pt with type 2 diabetes and essential hypertension, who has CKD stage 3a. <ref id="referral">eGFR 50, UACR 199 mg/g: please evaluate and manage CKD.</ref>

BP has been above goal on current therapy and I started a further agent today. Potassium 4.3 today and A1c 7.8%.

Please send your recommendations. I will continue routine follow-up here.

Thank you.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0480",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 199 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0480",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0480",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0480",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
