---
folio: "0.1"
id: "01HTGP2TS02M33D4RQQ02A7ZCS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272471"
effective: "2024-04-02T13:20:00-05:00"
recorded: "2024-04-02T19:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Stable.
BP 111/72, pulse 80, wt 150 lb.
Labs today: eGFR 58, K 4.9, A1c 7.5%, LDL 113 mg/dL.
Discussed diet. Will recheck LDL next visit.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040275",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040275",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-040275",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
