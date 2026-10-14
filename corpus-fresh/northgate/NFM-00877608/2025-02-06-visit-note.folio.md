---
folio: "0.1"
id: "01JKESVS50V8DCK496WEWV0DQE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877608"
effective: "2025-02-06T14:30:00-06:00"
recorded: "2025-02-06T17:35:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 156/97, pulse 69, wt 206 lb.
2/4 labs: eGFR 55, K 4.4, UACR 142 mg/g, A1c 6.6%. CKD stage 3a on problem list.
BP above goal, amlodipine started 5 mg daily today.
RTC 4 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-020698",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-020698",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-020698",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-020698",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
