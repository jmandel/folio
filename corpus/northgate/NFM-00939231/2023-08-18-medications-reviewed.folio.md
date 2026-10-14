---
folio: "0.1"
id: "01H852K5B0CBBB5DKDTFGC2N66"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2023-08-18T14:40:00-05:00"
recorded: "2023-08-18T14:40:12-05:00"
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
    "lines_on_list": ["ML-37582", "ML-29146", "ML-22305", "ML-46529", "ML-23707"],
    "visit_id": "V-2023-081873"
  }
}
```
