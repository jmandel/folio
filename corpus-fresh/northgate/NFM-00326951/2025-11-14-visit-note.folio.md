---
folio: "0.1"
id: "01KA2JXYR0913NBJAT70MAGMGH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00326951"
effective: "2025-11-14T14:50:00-06:00"
recorded: "2025-11-14T19:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK, no new symptoms. BP 130/84, pulse 75, wt 193 lb.

Reviewed home readings. Continue current plan, encouraged walking.

RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-111458",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-111458",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
