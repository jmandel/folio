---
folio: "0.1"
id: "01FMTFWAK09FXRG3JGA2G9DVAG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00980170"
effective: "2021-11-18T15:40:00-06:00"
recorded: "2021-11-18T15:40:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "lines_on_list": ["PL-10837", "PL-17131", "PL-18571", "PL-15891", "PL-13746"],
    "visit_id": "V-2021-111872"
  }
}
```
