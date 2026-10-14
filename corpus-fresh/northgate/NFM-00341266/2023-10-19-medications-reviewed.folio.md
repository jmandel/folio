---
folio: "0.1"
id: "01HD4K7HS034ECDFBPMGQAA25D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2023-10-19T13:30:00-05:00"
recorded: "2023-10-19T13:30:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
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
    "lines_on_list": ["ML-47239", "ML-42075", "ML-43939", "ML-31552"],
    "visit_id": "V-2023-101957"
  }
}
```
