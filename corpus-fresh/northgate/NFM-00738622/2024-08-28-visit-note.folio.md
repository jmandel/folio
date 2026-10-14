---
folio: "0.1"
id: "01J6DMAQ90PNZNXHEY8STCC0ZA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2024-08-28T15:10:00-05:00"
recorded: "2024-08-28T18:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well.
BP 131/82, pulse 80, wt 215 lb.
A1c 7% today, eGFR 59, K 4.6.
eGFR a little lower than before, will follow. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082871",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-082871",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
