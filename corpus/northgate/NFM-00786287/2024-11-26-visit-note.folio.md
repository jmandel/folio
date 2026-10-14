---
folio: "0.1"
id: "01JDMY2ST05YD9SERH8GBWKCBW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00786287"
effective: "2024-11-26T08:30:00-06:00"
recorded: "2024-11-26T13:10:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. No new complaints, tolerating things well.

BP 128/72, pulse 87, wt 216 lb.

Wt unchanged. Plan unchanged today.

RTC 6 mo, sooner if any problems.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112633",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-112633",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
