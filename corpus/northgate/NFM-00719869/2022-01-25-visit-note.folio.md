---
folio: "0.1"
id: "01FT98RQS0M5R15K6D2NZKZ941"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00719869"
effective: "2022-01-25T08:10:00-06:00"
recorded: "2022-01-25T12:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 141/93, pulse 63, wt 164 lb.
Labs today: eGFR 54, K 4.2, A1c 8.2%, LDL 58.
Empagliflozin started 10 mg daily today (A1c 8.2, CKD).
Reviewed genital hygiene and hydration with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-012514",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-012514",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-012514",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
