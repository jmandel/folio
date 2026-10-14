---
folio: "0.1"
id: "01J7YPXGH0E4QESDTMR3SV1D5Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00376120"
effective: "2024-09-16T15:40:00-05:00"
recorded: "2024-09-16T19:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 128/73, pulse 74, wt 179 lb.
Labs today: eGFR 65, K 4.7, LDL 121 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091697",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-091697",
    "rank": 1,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-091697",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
