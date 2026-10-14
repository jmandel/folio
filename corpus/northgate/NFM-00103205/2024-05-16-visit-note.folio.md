---
folio: "0.1"
id: "01HY1JDA70PYJR46ZG7KSWN2NW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2024-05-16T12:15:00-05:00"
recorded: "2024-05-16T15:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 118/71, pulse 87, wt 201 lb.
Labs 5/11: eGFR 66, K 4.4, A1c 6.3%.
Good control, reviewed with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-051699",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-051699",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
