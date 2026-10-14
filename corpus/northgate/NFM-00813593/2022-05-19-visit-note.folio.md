---
folio: "0.1"
id: "01G3ERBQZ0P45BFSS993Z6B3KM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2022-05-19T10:20:00-05:00"
recorded: "2022-05-19T13:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Feels fine.
BP 140/82, repeat 132/80, pulse 79, wt 225 lb.
Labs 5/13: eGFR 67, K 4.3, A1c 6.4%.
BP above goal, amlodipine started 5 mg daily today. Pt to watch for ankle swelling.
RTC 2-3 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-051999",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-051999",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
