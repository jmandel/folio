---
folio: "0.1"
id: "01GHYS2E302W4HXWX86B3VH1D2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00691499"
effective: "2022-11-15T11:40:00-06:00"
recorded: "2022-11-15T17:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new complaints.

BP 132/81, pulse 79, wt 193 lb.

Labs 11/10: eGFR 63, K 4.9.

Will recheck labs at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111543",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-111543",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-111543",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
