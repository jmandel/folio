---
folio: "0.1"
id: "01JATRF2Q039H4FKS7GSMJPJDA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00529403"
effective: "2024-10-22T13:40:00-05:00"
recorded: "2024-10-22T13:40:12-05:00"
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
    "list": "problems",
    "lines_on_list": ["PL-16930", "PL-10236", "PL-17806"],
    "visit_id": "V-2024-102218"
  }
}
```
