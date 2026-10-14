---
folio: "0.1"
id: "01GS6AACD0HW020MB06QVKANZ0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2023-02-13T09:45:00-06:00"
recorded: "2023-02-13T15:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.
BP 133/80, pulse 79, wt 179 lb.
2/8 labs: eGFR 61, K 4.5, UACR 110 mg/g, A1c 7.7%.
Reviewed results with pt.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-021365",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-021365",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
