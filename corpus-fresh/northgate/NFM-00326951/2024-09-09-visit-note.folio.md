---
folio: "0.1"
id: "01J7BRAG60HRVD6MCV2871T63D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00326951"
effective: "2024-09-09T08:10:00-05:00"
recorded: "2024-09-09T11:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints, no hypoglycemia symptoms. BP 133/83, pulse 65, wt 191 lb.

Continue current regimen. Labs before next visit.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-090956",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
