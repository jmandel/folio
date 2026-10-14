---
folio: "0.1"
id: "01GYGMXAN0EK188AMK7SM5MXBZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00170963"
effective: "2023-04-20T14:20:00-05:00"
recorded: "2023-04-20T19:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. A1c up, discussed with pt.

BP 138/76, pulse 67, wt 232 lb. Labs 4/18: eGFR 76, K 4.4, A1c 8.4%, LDL 106.

Dulaglutide: started 0.5 mg weekly today (A1c 8.4). Pt to call with any GI upset.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-042035",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-042035",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-042035",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
