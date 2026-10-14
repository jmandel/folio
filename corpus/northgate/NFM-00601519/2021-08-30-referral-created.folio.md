---
folio: "0.1"
id: "01FEC3TZH075ZBB5EJAX5A6QSE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2021-08-30T13:05:00-05:00"
recorded: "2021-08-30T13:06:12-05:00"
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

Thank you for seeing this pt with chronic kidney disease stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR is 45 with UACR 150 mg/g; I would appreciate your evaluation and help managing the CKD.</ref>

Kidney function has been stable but below normal for the past year, with persistent albuminuria despite ongoing diabetes and BP care in our office. We would value your recommendations on workup and on anything further we can do to slow progression.

Please send your notes after the visit. Happy to provide any records you need.

Thank you,
Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0735",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 45, UACR 150 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0735",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0735",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0735",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
