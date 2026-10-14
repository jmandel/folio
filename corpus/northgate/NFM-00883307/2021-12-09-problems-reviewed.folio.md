---
folio: "0.1"
id: "01FPG6S6V0C9WHTX7FG0N7A54Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00883307"
effective: "2021-12-09T12:20:00-06:00"
recorded: "2021-12-09T12:20:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
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
    "lines_on_list": ["PL-16651", "PL-19540", "PL-10539", "PL-17133"],
    "visit_id": "V-2021-120916"
  }
}
```
