---
folio: "0.1"
id: "01J6T11DR0PXJ28EEZP5BWFEG0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00556918"
effective: "2024-09-02T11:30:00-05:00"
recorded: "2024-09-02T13:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 131/72, pulse 81, wt 225 lb.
Labs today: eGFR 47, K 4.5, A1c 8.6%, LDL 77 mg/dL.
A1c 8.6 with CKD, dapagliflozin started 10 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-090278",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-090278",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-090278",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
