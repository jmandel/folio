---
folio: "0.1"
id: "01JATRF2Q0QKCX5MYSR4NRCYGD"
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
    "list": "medications",
    "lines_on_list": ["ML-36598", "ML-38800", "ML-34302", "ML-17315", "ML-16329"],
    "visit_id": "V-2024-102218"
  }
}
```
