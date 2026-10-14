---
folio: "0.1"
id: "01FTCAEBA0STZPPQ421ZF9G98B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00039111"
effective: "2022-01-26T15:15:00-06:00"
recorded: "2022-01-26T17:10:00-06:00"
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
    "visit_id": "V-2022-012625",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
