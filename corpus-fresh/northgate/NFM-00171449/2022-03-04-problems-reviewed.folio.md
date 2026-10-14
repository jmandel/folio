---
folio: "0.1"
id: "01FXB1ZZX0DWKDBWHGMAGQ24JR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00171449"
effective: "2022-03-04T12:10:00-06:00"
recorded: "2022-03-04T12:10:12-06:00"
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
    "lines_on_list": ["PL-9358", "PL-19853", "PL-18527", "PL-9364", "PL-16522"],
    "visit_id": "V-2022-030457"
  }
}
```
