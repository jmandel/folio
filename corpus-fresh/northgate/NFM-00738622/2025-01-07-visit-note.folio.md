---
folio: "0.1"
id: "01JH1WPES0320AET50CSP8ADXG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2025-01-07T15:45:00-06:00"
recorded: "2025-01-07T20:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 126/80, pulse 88, wt 214 lb.
Labs 1/1: A1c 7.2%, eGFR 56, K 4.7, LDL 110 mg/dL.
CKD stage 3a added to problem list. Discussed what this means with pt, will keep monitoring kidney labs.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-010759",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-010759",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-010759",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
