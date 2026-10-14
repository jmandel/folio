---
folio: "0.1"
id: "01JVAPSZD040EFRNX78AWTMKPZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770531"
effective: "2025-05-15T14:30:00-05:00"
recorded: "2025-05-15T14:30:12-05:00"
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
    "list": "problems",
    "lines_on_list": ["PL-14457", "PL-18006", "PL-9666"],
    "visit_id": "V-2025-051578"
  }
}
```
