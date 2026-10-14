---
folio: "0.1"
id: "01GKMTAQT01P09G2N4MVZT2ABW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2022-12-06T13:40:00-06:00"
recorded: "2022-12-06T16:54:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u.
BP 131/79, pulse 84, wt 214 lb.
Labs 12/2: A1c 8.2%, eGFR 65, K 4.4.
A1c up. Semaglutide started 0.5 mg weekly today. Reviewed injection technique and GI side effects to watch for.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-120627",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-120627",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-120627",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
