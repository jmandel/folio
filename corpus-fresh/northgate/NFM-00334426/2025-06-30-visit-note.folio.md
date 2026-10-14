---
folio: "0.1"
id: "01JZ12G8Z00R14ZA8MAF6QX2NX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00334426"
effective: "2025-06-30T11:31:00-05:00"
recorded: "2025-06-30T13:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Feeling better, vomiting resolved.
Eating and drinking normally.
Metformin resumed today (eating and drinking normally).
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-063079",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
