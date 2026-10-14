---
folio: "0.1"
id: "01F2HQ3ZD0PWCA3M4SQ4WTHCTQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2021-04-05T12:30:00-05:00"
recorded: "2021-04-05T14:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.
BP 130/76, pulse 74, wt 200 lb.
Today: eGFR 69, K 4.3, UACR 79 mg/g, A1c 7.3%, LDL 183 mg/dL.
Discussed lipid result and diet with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-040588",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-040588",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-040588",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
