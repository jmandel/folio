---
folio: "0.1"
id: "01KRY1ME70J7QSHHSTWQ7JQXE1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00347581"
effective: "2026-05-18T12:20:00-05:00"
recorded: "2026-05-18T12:20:12-05:00"
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
    "lines_on_list": ["ML-39617", "ML-33750", "ML-29268", "ML-12956", "ML-18011", "ML-13127"],
    "visit_id": "V-2026-051838"
  }
}
```
