---
folio: "0.1"
id: "01JXBF18B0M1QKXSTAZ0M4V94Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2025-06-09T15:46:00-05:00"
recorded: "2025-06-09T18:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feeling better, vomiting resolved.
Metformin resumed today (eating and drinking normally).
Call if symptoms come back.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-060969",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
