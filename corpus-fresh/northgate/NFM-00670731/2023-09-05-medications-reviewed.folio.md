---
folio: "0.1"
id: "01H9KJ1DW06WF8CVE6V6VBVDRT"
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
    "list": "medications",
    "lines_on_list": ["ML-32188", "ML-21025", "ML-44954", "ML-29302", "ML-12692"],
    "visit_id": "V-2023-090541"
  }
}
```
