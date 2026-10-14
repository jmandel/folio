---
folio: "0.1"
id: "01FE4NJ3E0DHZFMM4JH273770C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00621637"
effective: "2021-08-27T09:15:00-05:00"
recorded: "2021-08-27T15:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u.

BP 147/84, pulse 75, wt 192 lb.

Labs today: eGFR 66, K 4.3, UACR 83 mg/g, A1c 7.2%, LDL 149.

BP above goal, started chlorthalidone 12.5 mg daily today. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-082724",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-082724",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-082724",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
