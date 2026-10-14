---
folio: "0.1"
id: "01F896QTF08VQ3G7QKY0EMM9DB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2021-06-15T14:40:00-05:00"
recorded: "2021-06-15T20:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.
BP 147/90, repeat 143/87. Pulse 66, wt 222 lb.
6/12 labs: eGFR 62, K 4.1, UACR 293 mg/g, A1c 6.2%, LDL 111 mg/dL.
BP above goal today, will recheck next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-061523",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-061523",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-061523",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
