---
folio: "0.1"
id: "01FEBVFMV0E8ANGP8YM9FKF9Q3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2021-08-30T10:40:00-05:00"
recorded: "2021-08-30T10:40:12-05:00"
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
    "lines_on_list": ["ML-26665", "ML-29896", "ML-36539", "ML-38702", "ML-26086"],
    "visit_id": "V-2021-083084"
  }
}
```
