---
folio: "0.1"
id: "01GN0HC1009PYZ4BWR2ZHEZ9FZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363440"
effective: "2022-12-23T10:00:00-06:00"
recorded: "2022-12-23T16:24:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-122379",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-122379",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-122379",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
