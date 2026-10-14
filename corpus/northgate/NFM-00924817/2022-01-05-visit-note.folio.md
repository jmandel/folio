---
folio: "0.1"
id: "01FRP97W601Q09C3CYRKXF7AVV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924817"
effective: "2022-01-05T14:45:00-06:00"
recorded: "2022-01-05T17:30:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No headache or chest pain.
BP 137/80, pulse 74, wt 246 lb.
eGFR 96, K 4.5 today.
Discussed home BP checks and diet.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-010563",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-010563",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
