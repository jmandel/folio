---
folio: "0.1"
id: "01HMCX2FP03NS8CCYYCD18YRDT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620040"
effective: "2024-01-17T13:19:00-06:00"
recorded: "2024-01-17T17:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, sick with vomiting and poor oral intake.
Metformin held today (vomiting, poor oral intake). Review 1/24.
Advised fluids in small sips. Call back or go to ED if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-011762",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
