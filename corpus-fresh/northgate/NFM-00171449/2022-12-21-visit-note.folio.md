---
folio: "0.1"
id: "01GMTZ0M90SRB6B7RA9NKBNRR5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00171449"
effective: "2022-12-21T09:30:00-06:00"
recorded: "2022-12-21T12:27:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well, no new symptoms.

BP 139/84, pulse 78, wt 209 lb.

Labs today: eGFR 54, K 5, UACR 529 mg/g, A1c 7.6%.

Reviewed labs with pt. RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-122159",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-122159",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-122159",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-122159",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
