---
folio: "0.1"
id: "01FPXEJ0500VV64MEXBBNMVZCA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00045785"
effective: "2021-12-14T15:45:00-06:00"
recorded: "2021-12-14T15:46:12-06:00"
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

<ref id="referral">I am referring this pt for CKD evaluation and management, with eGFR 66 and UACR 607 mg/g.</ref>

Pt has type 2 diabetes and essential hypertension, both followed here. BP has been above goal and we adjusted therapy today. Please advise on further workup and management of the kidney disease.

Thank you for seeing this pt. Please send your recommendations to our office.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1847",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 66, UACR 607 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1847",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1847",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1847",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
