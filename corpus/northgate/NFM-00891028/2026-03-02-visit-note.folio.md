---
folio: "0.1"
id: "01KJRQ21709M1X78B6M6A12FTE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00891028"
effective: "2026-03-02T14:26:00-06:00"
recorded: "2026-03-02T20:05:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feeling better, vomiting resolved.
Eating and drinking normally, so losartan resumed today.
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-030261",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
