---
folio: "0.1"
id: "01HFQEDE90DQC3JMB0M9J56A0Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877608"
effective: "2023-11-20T11:50:00-06:00"
recorded: "2023-11-20T16:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c up, BP also above goal.
BP 146/87, repeat 141/85, pulse 78, wt 205 lb.
11/17 labs: eGFR 63, K 4.5, A1c 8.3%.
Insulin glargine started today, 10 units at bedtime. Chlorthalidone started 12.5 mg daily today for BP above goal.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-112059",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-112059",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
