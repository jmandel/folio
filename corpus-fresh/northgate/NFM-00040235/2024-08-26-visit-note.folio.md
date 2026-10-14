---
folio: "0.1"
id: "01J68KA4F0TVWJZGXDYQAPK9AT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00040235"
effective: "2024-08-26T15:40:00-05:00"
recorded: "2024-08-26T19:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.

BP 133/86, pulse 62, wt 173 lb.

Labs 8/20: eGFR 88, K 4.4, A1c 7.4%, LDL 91 mg/dL.

Reviewed results with pt. Cont current plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082639",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-082639",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-082639",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
