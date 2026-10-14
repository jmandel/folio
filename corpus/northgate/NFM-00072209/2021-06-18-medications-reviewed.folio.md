---
folio: "0.1"
id: "01F8G66ES0CFQKHAKXA271MDD7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2021-06-18T13:30:00-05:00"
recorded: "2021-06-18T13:30:12-05:00"
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
    "lines_on_list": ["ML-47150", "ML-34420", "ML-33367", "ML-38057", "ML-14345", "ML-10085", "ML-34784"],
    "visit_id": "V-2021-061877"
  }
}
```
