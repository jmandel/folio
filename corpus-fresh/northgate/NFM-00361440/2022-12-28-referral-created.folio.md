---
folio: "0.1"
id: "01GNDC1W208YQ1ZPRC37TFR39Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00361440"
effective: "2022-12-28T16:00:00-06:00"
recorded: "2022-12-28T16:01:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this pt with CKD, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 46 and UACR 122 mg/g; requesting CKD evaluation and management.</ref>

He was recently hospitalized with euglycemic DKA and is back in clinic for follow-up. BP remains above goal in the office. Please advise on further workup and on kidney-protective strategy given his diabetes and blood pressure.

Recent labs are available on request. Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1077",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 46, UACR 122 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1077",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1077",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1077",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
