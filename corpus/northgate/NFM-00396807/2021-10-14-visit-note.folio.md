---
folio: "0.1"
id: "01FJ05C7K0F3JVB4HCV1PMQ4VZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00396807"
effective: "2021-10-14T10:20:00-05:00"
recorded: "2021-10-14T14:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 137/86, pulse 70, wt 224 lb.
Labs 10/11: eGFR 67, K 4.9, A1c 6.9%.
Reviewed results with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-101477",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-101477",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-101477",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
