---
folio: "0.1"
id: "01FS5TDX905Y3BG1TWAWAN563H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00451037"
effective: "2022-01-11T13:10:00-06:00"
recorded: "2022-01-11T18:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.
BP 147/93, repeat 144/93, pulse 64, wt 263 lb.
Labs today: eGFR 57, K 4.3, UACR 64 mg/g, LDL 109 mg/dL.
Will review results with pt and f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-011166",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-011166",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-011166",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
