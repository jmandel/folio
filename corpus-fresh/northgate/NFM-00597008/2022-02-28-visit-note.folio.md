---
folio: "0.1"
id: "01FX11C7D0AJ2JFEFB9PG661H7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00597008"
effective: "2022-02-28T12:10:00-06:00"
recorded: "2022-02-28T14:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 144/91, repeat 137/90, pulse 67, wt 193 lb.
Today: eGFR 58, K 4.9, UACR 11 mg/g, A1c 6.7%, LDL 119 mg/dL.
BP above goal, chlorthalidone started 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-022893",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-022893",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
