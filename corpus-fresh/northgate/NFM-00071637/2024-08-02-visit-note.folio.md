---
folio: "0.1"
id: "01J4ADXVJ0DW5JF7NW20Z1D848"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00071637"
effective: "2024-08-02T10:20:00-05:00"
recorded: "2024-08-02T15:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.

BP 143/80, repeat 137/76, pulse 71, wt 200 lb.
eGFR 49, K 4.8, A1c 7.2% today.

Kidney function a bit lower than before. Pt to keep up fluids and diet.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-080249",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-080249",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-080249",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
