---
folio: "0.1"
id: "01F7M7N6Z0RA8M0P4EETCJ93FR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00650029"
effective: "2021-06-07T12:45:00-05:00"
recorded: "2021-06-07T16:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.
BP 145/88, repeat 138/87, pulse 79, wt 184 lb.
BP above goal; lisinopril changed to 20 mg daily today.
RTC 1 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-060739",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-060739",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-060739",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-060739",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
