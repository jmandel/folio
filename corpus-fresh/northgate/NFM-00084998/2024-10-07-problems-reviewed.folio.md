---
folio: "0.1"
id: "01J9KPRV7008XWAD6EY1CQPS95"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084998"
effective: "2024-10-07T09:40:00-05:00"
recorded: "2024-10-07T09:40:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "lines_on_list": ["PL-12525", "PL-14605", "PL-16496", "PL-10942", "PL-19341"],
    "visit_id": "V-2024-100787"
  }
}
```
