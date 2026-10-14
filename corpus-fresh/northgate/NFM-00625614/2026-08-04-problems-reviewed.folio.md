---
folio: "0.1"
id: "01KZ73SCE0SC0BC32GAG27Y1E6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625614"
effective: "2026-08-04T14:25:00-05:00"
recorded: "2026-08-04T14:25:12-05:00"
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
    "lines_on_list": ["PL-9257", "PL-19539", "PL-9830", "PL-15925", "PL-9626"],
    "visit_id": "V-2026-080485"
  }
}
```
