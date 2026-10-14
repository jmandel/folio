---
folio: "0.1"
id: "01G5SNSMM03F4DVAXRPZM5M0H8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00349670"
effective: "2022-06-17T15:30:00-05:00"
recorded: "2022-06-17T15:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. Lakeview Kidney Care colleagues,

Thank you for seeing this new patient of mine with type 2 diabetes and essential hypertension. Labs at the first visit here on 6/17 showed <ref id="referral">eGFR 55 and UACR 380 mg/g. Referring for CKD evaluation and management.</ref>

Potassium was 4.5 and BP 125/75 at the visit. I would appreciate your help with workup and recommendations for kidney care. I will continue to manage the diabetes and blood pressure here and can send any further records you need.

Thank you for your help.

Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2022-1013",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 55, UACR 380 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1013",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1013",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1013",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
