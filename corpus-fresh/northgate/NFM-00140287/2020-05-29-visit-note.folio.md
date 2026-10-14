---
folio: "0.1"
id: "01E9GQG620EHBGX30RV6ZZZ8E9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2020-05-29T08:45:00-05:00"
recorded: "2020-05-29T12:26:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 138/87, pulse 67, wt 157 lb.
A1c 7.1% today, improved. eGFR 43, K 4.8, UACR 224 mg/g.
Persistent eGFR in the 40s with albuminuria, so CKD stage 3b now on the problem list.
Pt doing well, no new complaints. RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-052923",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-052923",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-052923",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
