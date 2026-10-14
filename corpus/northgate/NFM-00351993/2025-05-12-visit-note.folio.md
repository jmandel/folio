---
folio: "0.1"
id: "01JV3A2HB015J122PTM0XAFR16"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351993"
effective: "2025-05-12T15:15:00-05:00"
recorded: "2025-05-12T17:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 133/81, pulse 86, wt 151 lb.
Labs today: eGFR 44, K 4.5, UACR 31 mg/g, A1c 7.1%, LDL 144.
Metformin dose changed to 500 mg twice daily today (eGFR 44). Referring to nephrology.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051237",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051237",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-051237",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
