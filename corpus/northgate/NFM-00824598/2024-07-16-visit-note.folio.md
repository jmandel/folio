---
folio: "0.1"
id: "01J2YFZ0H04YQX47P54PNR96RY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00824598"
effective: "2024-07-16T10:40:00-05:00"
recorded: "2024-07-16T14:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt doing well, no new symptoms.
BP 121/72, pulse 79, wt 261 lb.
Labs today: eGFR 66, K 4.2, UACR 9 mg/g, A1c 7.4%.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071614",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-071614",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
