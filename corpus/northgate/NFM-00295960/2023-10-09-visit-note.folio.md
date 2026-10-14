---
folio: "0.1"
id: "01HCBHV8K0G198MZ3CW1EV830K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00295960"
effective: "2023-10-09T15:30:00-05:00"
recorded: "2023-10-09T20:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 144/86, pulse 75, wt 247 lb.
Today: eGFR 98, K 3.9, LDL 79 mg/dL.
Amlodipine started 5 mg daily today, BP above goal.
Pt agrees with plan. RTC 4-6 wks to recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-100968",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-100968",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-100968",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
