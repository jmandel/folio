---
folio: "0.1"
id: "01KBDDDXC0Q3WAD69V4CJVAGSE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2025-12-01T10:55:00-06:00"
recorded: "2025-12-01T10:55:12-06:00"
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
    "lines_on_list": ["ML-10804", "ML-26428", "ML-18340", "ML-13112", "ML-24894"],
    "visit_id": "V-2025-120196"
  }
}
```
