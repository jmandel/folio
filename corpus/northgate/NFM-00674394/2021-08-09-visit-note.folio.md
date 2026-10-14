---
folio: "0.1"
id: "01FCPMK34094WW046EX7C5CF8F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00674394"
effective: "2021-08-09T13:10:00-05:00"
recorded: "2021-08-09T18:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK, no new symptoms.
BP 141/82, repeat 136/79, pulse 73, wt 226 lb.
Labs 8/6: eGFR 74, K 4.5, UACR 131 mg/g, A1c 7.8%.
Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-080983",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-080983",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
