---
folio: "0.1"
id: "01FR9KNBP0TS4C7JSYGW5P5DK2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2021-12-31T15:00:00-06:00"
recorded: "2021-12-31T19:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 142/89, pulse 73, wt 241 lb.

Labs today: eGFR 72, K 4.1, A1c 7.5%, LDL 146 mg/dL.

BP still above goal, amlodipine started 5 mg daily today.

RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-123142",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-123142",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
