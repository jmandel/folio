---
folio: "0.1"
id: "01FN4N5GB0FDMF3C81SB0HC6J2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2021-11-22T09:40:00-06:00"
recorded: "2021-11-22T14:25:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 143/87, pulse 79, wt 217 lb.
11/18 labs: A1c 7.5%, eGFR 59, K 4, LDL 140 mg/dL.
CKD stage 3a on problem list, discussed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-112295",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-112295",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
