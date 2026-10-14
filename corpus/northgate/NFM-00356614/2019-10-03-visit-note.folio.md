---
folio: "0.1"
id: "01DPA20Z30Z4FRY1MWAYCFBN0Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2019-10-03T13:20:00-05:00"
recorded: "2019-10-03T19:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 135/86, pulse 67, wt 233 lb.
eGFR 66, K 4, UACR 295 mg/g, A1c 8.3%, LDL 145 mg/dL today.
Metformin dose changed to 1000 mg twice daily today (A1c 8.3).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-100347",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-100347",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-100347",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
