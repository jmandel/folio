---
folio: "0.1"
id: "01EQKH27D05PX03G8T41MDCTY3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2020-11-20T08:45:00-06:00"
recorded: "2020-11-20T13:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 144/83, repeat 137/81, pulse 65, wt 194 lb.
eGFR 68, K 4.3, A1c 7.2% today.
BP improved on repeat. Diet and exercise discussed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-112063",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-112063",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
