---
folio: "0.1"
id: "01J1800FY0XSR09CMXH5Q9ACE8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531772"
effective: "2024-06-25T10:25:00-05:00"
recorded: "2024-06-25T10:25:12-05:00"
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
    "lines_on_list": ["ML-10462", "ML-49873"],
    "visit_id": "V-2024-062579"
  }
}
```
