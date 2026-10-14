---
folio: "0.1"
id: "01G16T5310G9R04G4F3X3Z08SF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00655539"
effective: "2022-04-21T12:45:00-05:00"
recorded: "2022-04-21T14:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 137/85, pulse 88, wt 232 lb.
Labs today: eGFR 98, K 4.5, UACR 378 mg/g, A1c 7.2%, LDL 160.
Diet and exercise reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-042191",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-042191",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
