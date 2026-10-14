---
folio: "0.1"
id: "01EZFQHV30TSG3ZZ7JGRC6FWD5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924817"
effective: "2021-02-26T08:50:00-06:00"
recorded: "2021-02-26T11:53:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 133/84, pulse 68, wt 244 lb.
Labs today: eGFR 98, K 4.2, LDL 108 mg/dL.
Results reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-022627",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-022627",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
