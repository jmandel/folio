---
folio: "0.1"
id: "01HVJ03CB06ED1P10YEPFPTRKZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00330505"
effective: "2024-04-15T13:50:00-05:00"
recorded: "2024-04-15T18:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-041581",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
