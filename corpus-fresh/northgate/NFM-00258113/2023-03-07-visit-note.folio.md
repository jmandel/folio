---
folio: "0.1"
id: "01GTZ5BKQ0TPYASQJ4S03X3W06"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2023-03-07T13:15:00-06:00"
recorded: "2023-03-07T17:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK.
BP 130/82, pulse 71, wt 171 lb.
Today: eGFR 59, K 4.3, A1c 7.4%, UACR 121 mg/g.
UACR trending up, discussed with pt. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-030785",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-030785",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-030785",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
