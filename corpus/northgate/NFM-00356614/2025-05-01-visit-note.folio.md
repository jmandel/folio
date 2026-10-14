---
folio: "0.1"
id: "01JT74X8C0RAS5F2VNYTNV0AGB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2025-05-01T14:00:00-05:00"
recorded: "2025-05-01T19:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 137/80, pulse 83, wt 234 lb.
Labs 4/26: eGFR 50, K 4.4, A1c 7.9%, LDL 121 mg/dL.
A1c a little up. Diet and activity discussed.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-050121",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-050121",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-050121",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
