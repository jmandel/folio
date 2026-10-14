---
folio: "0.1"
id: "01FY7Q03M0JH530SVQ6RATK39K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00888547"
effective: "2022-03-15T10:15:00-05:00"
recorded: "2022-03-15T16:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 132/78, pulse 88, wt 200 lb.
eGFR 68, K 4.8 today.

BP at goal. Pt doing well, no complaints. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-031545",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-031545",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
