---
folio: "0.1"
id: "01GGD2JE70EV4VNY6MFGJ650A4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2022-10-27T09:00:00-05:00"
recorded: "2022-10-27T10:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 137/82, pulse 64, wt 155 lb.

Labs 10/22: A1c 7.9%, eGFR 48, K 4.6, UACR 84 mg/g. CKD stage 3a on problem list.

Pt doing well, no new complaints. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-102779",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-102779",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-102779",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
