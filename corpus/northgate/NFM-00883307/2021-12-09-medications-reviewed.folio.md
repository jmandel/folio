---
folio: "0.1"
id: "01FPG6S6V0F55WV4SPCQ4PDAEP"
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
    "list": "medications",
    "lines_on_list": ["ML-39220", "ML-41768", "ML-36452", "ML-13600"],
    "visit_id": "V-2021-120995"
  }
}
```
