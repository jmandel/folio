---
folio: "0.1"
id: "01JTHBJR30V2FWC8DB3WYT4JSN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00184341"
effective: "2025-05-05T12:42:00-05:00"
recorded: "2025-05-05T18:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone f/u. Pt feeling better, vomiting resolved.
Eating and drinking normally.
Losartan resumed today (eating and drinking normally).
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-050541",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
