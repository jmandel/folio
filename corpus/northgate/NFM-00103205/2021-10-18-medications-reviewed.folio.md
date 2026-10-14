---
folio: "0.1"
id: "01FJ9WYP900F7J5V3Q2JCRRC1K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2021-10-18T09:30:00-05:00"
recorded: "2021-10-18T09:30:12-05:00"
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
    "lines_on_list": ["ML-46569", "ML-45318", "ML-15470", "ML-16818"],
    "visit_id": "V-2021-101879"
  }
}
```
