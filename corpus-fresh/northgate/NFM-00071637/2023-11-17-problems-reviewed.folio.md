---
folio: "0.1"
id: "01HFF45X900X18QT9H0AH40RB9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00071637"
effective: "2023-11-17T11:10:00-06:00"
recorded: "2023-11-17T11:10:12-06:00"
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
    "lines_on_list": ["PL-15317", "PL-9654", "PL-13875", "PL-18129", "PL-11337"],
    "visit_id": "V-2023-111765"
  }
}
```
