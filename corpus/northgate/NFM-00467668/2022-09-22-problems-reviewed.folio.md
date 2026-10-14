---
folio: "0.1"
id: "01GDKD4X50Z58GD3KE97KA3ZMW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00467668"
effective: "2022-09-22T15:10:00-05:00"
recorded: "2022-09-22T15:10:12-05:00"
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
    "lines_on_list": ["PL-13960", "PL-15498", "PL-13125"],
    "visit_id": "V-2022-092214"
  }
}
```
