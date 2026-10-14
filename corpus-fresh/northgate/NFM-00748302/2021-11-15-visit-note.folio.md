---
folio: "0.1"
id: "01FMJQFBD0J66QHW0F9ADDBBZ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00748302"
effective: "2021-11-15T09:25:00-06:00"
recorded: "2021-11-15T15:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feels better, vomiting resolved.
Metformin resumed today (eating and drinking normally).
Call if symptoms return.
Keep scheduled f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-111535",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
