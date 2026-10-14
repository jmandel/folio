---
folio: "0.1"
id: "01J543YSC067XKRM3AQKEZ7A82"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00396807"
effective: "2024-08-12T12:20:00-05:00"
recorded: "2024-08-12T15:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well.
BP 134/78, pulse 72, wt 227 lb.
Labs 8/7: eGFR 60, K 4.5, A1c 7.1%, LDL 85 mg/dL.
A1c better than last. Reviewed results with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-081227",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-081227",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-081227",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
