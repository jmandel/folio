---
folio: "0.1"
id: "01FPXE70K0XBG8759WBYAWH8DZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00045785"
effective: "2021-12-14T15:40:00-06:00"
recorded: "2021-12-14T15:40:12-06:00"
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
    "lines_on_list": ["PL-9301", "PL-13468", "PL-16118", "PL-17121"],
    "visit_id": "V-2021-121445"
  }
}
```
