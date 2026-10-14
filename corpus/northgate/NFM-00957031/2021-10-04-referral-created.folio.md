---
folio: "0.1"
id: "01FH6DF7X020FKFA4GVV1YARMW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00957031"
effective: "2021-10-04T14:45:00-05:00"
recorded: "2021-10-04T14:46:12-05:00"
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

Thank you for seeing this pt with type 2 diabetes and essential hypertension. <ref id="referral">I am referring for CKD evaluation and management: eGFR 50, UACR 462 mg/g.</ref> Problem list carries chronic kidney disease stage 3a.

Albuminuria has persisted despite ongoing care here, and I would appreciate your input on further workup and management of his kidney disease. Please send recommendations to our office and we will continue to follow BP and diabetes in primary care.

Thank you,
Daniel Khan, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1186",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 462 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1186",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1186",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1186",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
