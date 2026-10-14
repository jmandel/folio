---
folio: "0.1"
id: "01H9KJ1DW0CB6SJ423H2DYNSDP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2023-09-05T15:55:00-05:00"
recorded: "2023-09-05T15:55:12-05:00"
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
    "lines_on_list": ["PL-19634", "PL-15695", "PL-14691", "PL-11097", "PL-14964"],
    "visit_id": "V-2023-090541"
  }
}
```
