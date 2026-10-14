---
folio: "0.1"
id: "01DY3KFMF0QZK03B7MVMX8BQSZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2020-01-08T12:00:00-06:00"
recorded: "2020-01-08T16:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN and DM2 per pt.
BP 138/89, pulse 79, wt 198 lb.
Labs from 1/3: eGFR 71, K 4.4, UACR 52 mg/g, A1c 8%, LDL 156 mg/dL.
Reviewed results with pt. Records requested from prior office.
RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-010812",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-010812",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
