---
folio: "0.1"
id: "01D588X9R007S6YV5XYKBG8164"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00160060"
effective: "2019-03-05T14:15:00-06:00"
recorded: "2019-03-05T19:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 139/84, pulse 84, wt 230 lb.
eGFR 70 today, K 4.3, LDL 63.
Labs reviewed with pt, no concerns.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-030566",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-030566",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
