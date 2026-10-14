---
folio: "0.1"
id: "01HEJTCA705R3WFG3PS8PWMK8A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2023-11-06T11:20:00-06:00"
recorded: "2023-11-06T11:20:12-06:00"
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
    "lines_on_list": ["PL-14571", "PL-11126", "PL-14799", "PL-18863", "PL-18288", "PL-14713"],
    "visit_id": "V-2023-110672"
  }
}
```
