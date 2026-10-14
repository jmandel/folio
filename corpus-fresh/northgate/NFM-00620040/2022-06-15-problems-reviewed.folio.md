---
folio: "0.1"
id: "01G5KW21A063VPJ4RZFXSR1D5M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620040"
effective: "2022-06-15T09:25:00-05:00"
recorded: "2022-06-15T09:25:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "lines_on_list": ["PL-9974", "PL-11202", "PL-13927", "PL-10570", "PL-12257"],
    "visit_id": "V-2022-061593"
  }
}
```
