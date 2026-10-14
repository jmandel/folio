---
folio: "0.1"
id: "01H1PVBM50F0KSV5CHNZ8X4D2K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00358696"
effective: "2023-05-30T12:30:00-05:00"
recorded: "2023-05-30T12:30:12-05:00"
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
    "lines_on_list": ["PL-12898", "PL-17543", "PL-17451", "PL-15027"],
    "visit_id": "V-2023-053041"
  }
}
```
