---
folio: "0.1"
id: "01GHW657R0011Z5BY29N3F7369"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00888547"
effective: "2022-11-14T11:10:00-06:00"
recorded: "2022-11-14T17:04:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 143/87, repeat 140/87, pulse 85, wt 202 lb.
eGFR 67, K 4.5, LDL 96 mg/dL today.

BP a bit above goal. Discussed low salt diet and home BP log. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111483",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-111483",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
