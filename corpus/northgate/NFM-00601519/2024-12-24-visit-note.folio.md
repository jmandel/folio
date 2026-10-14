---
folio: "0.1"
id: "01JFX6BQ80AAYA2K8YWXXM2P62"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2024-12-24T09:00:00-06:00"
recorded: "2024-12-24T14:40:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 135/75, pulse 82, wt 164 lb.
eGFR 37, K 4.7, A1c 7.3% today.
eGFR down a bit from last check, will recheck. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-122458",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-122458",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-122458",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
