---
folio: "0.1"
id: "01FEC3FZZ0TAC8MA6KM73XC9MM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2021-08-30T13:00:00-05:00"
recorded: "2021-08-30T13:00:12-05:00"
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
    "lines_on_list": ["PL-15806", "PL-15047", "PL-19913", "PL-12291"],
    "visit_id": "V-2021-083019"
  }
}
```
