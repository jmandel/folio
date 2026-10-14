---
folio: "0.1"
id: "01JA6CRTS0VXSRW23EBDTHENER"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00338283"
effective: "2024-10-14T10:09:00-05:00"
recorded: "2024-10-14T15:51:00-05:00"
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

Eating and drinking normally, so metformin resumed today.

Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101451",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
