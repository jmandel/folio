---
folio: "0.1"
id: "01KHPJTVQ049GY7SCNA7CH7VK4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00570381"
effective: "2026-02-17T11:30:00-06:00"
recorded: "2026-02-17T13:57:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well.
BP 133/82, pulse 76, wt 226 lb.
Labs 2/15: eGFR 89, K 4.3, A1c 7.7%, LDL 79 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021794",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-021794",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
