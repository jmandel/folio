---
folio: "0.1"
id: "01GX4333K0MC548Q41GCX8Q8QV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625829"
effective: "2023-04-03T10:40:00-05:00"
recorded: "2023-04-03T12:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no hypoglycemia symptoms reported.

BP 145/94, pulse 84, wt 179 lb. BP elevated today.

Labs today: eGFR 62, K 4.5, A1c 7.1%.

A1c improved. Pt to check BP at home and bring log. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-040394",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-040394",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-040394",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
