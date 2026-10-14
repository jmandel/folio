---
folio: "0.1"
id: "01FYQBAVC0MYX8X033044ATFD9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00315133"
effective: "2022-03-21T14:10:00-05:00"
recorded: "2022-03-21T18:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 132/74, pulse 85, wt 220 lb.
3/17 labs: eGFR 43, K 4.6, A1c 8.4%. CKD stage 3b.
A1c still above goal. Insulin glargine started 10 units at bedtime today (A1c 8.4).
Reviewed hypoglycemia symptoms with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-032163",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-032163",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-032163",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
