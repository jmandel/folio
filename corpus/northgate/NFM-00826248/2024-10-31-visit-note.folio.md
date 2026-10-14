---
folio: "0.1"
id: "01JBHYYFG0220K4476N2ERXEX9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00826248"
effective: "2024-10-31T11:30:00-05:00"
recorded: "2024-10-31T13:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt doing well.
BP 107/55, pulse 70, wt 155 lb.
10/27 labs: eGFR 47, K 4.5, A1c 7.3%, LDL 149 mg/dL.
Empagliflozin started 10 mg daily today (CKD + DM, cardiorenal benefit). Reviewed what to expect with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-103159",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-103159",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-103159",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
