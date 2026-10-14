---
folio: "0.1"
id: "01HNP12XB0NHG5P6CM96P96W7E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00984511"
effective: "2024-02-02T13:15:00-06:00"
recorded: "2024-02-02T17:05:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 152/92, repeat 144/88, pulse 85, wt 233 lb.

Labs today: eGFR 96, K 4.5, LDL 123 mg/dL.

BP still above goal. Reviewed home readings and diet with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-020217",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-020217",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-020217",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
