---
folio: "0.1"
id: "01FDATM2909W4CTMH8831TMC24"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00985366"
effective: "2021-08-17T14:50:00-05:00"
recorded: "2021-08-17T14:50:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "review": {
    "type": "list_reviewed",
    "list": "medications",
    "lines_on_list": ["ML-11322", "ML-43371", "ML-22825", "ML-47388"],
    "visit_id": "V-2021-081717"
  }
}
```
