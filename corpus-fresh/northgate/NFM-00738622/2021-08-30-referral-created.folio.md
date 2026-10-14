---
folio: "0.1"
id: "01FEBVTMD0ZJ1GP9YDSJA453DS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2021-08-30T10:45:00-05:00"
recorded: "2021-08-30T10:46:12-05:00"
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

Thank you for seeing this patient with type 2 diabetes and essential hypertension, who also carries a diagnosis of chronic kidney disease. Albuminuria has been rising over the past two years, and BP and A1c have been fairly steady. I am referring for <ref id="referral">eGFR 68, UACR 675 mg/g: CKD evaluation and management</ref>. Labs were drawn today at the diabetes visit. Please advise on further workup and anything we should change in the kidney-protective plan. Recent notes and results are available on request.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1964",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 68, UACR 675 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1964",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1964",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1964",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
