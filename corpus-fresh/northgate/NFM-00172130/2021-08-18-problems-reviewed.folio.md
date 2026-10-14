---
folio: "0.1"
id: "01FDCTPV90D394CFRQA6E16W96"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172130"
effective: "2021-08-18T09:30:00-05:00"
recorded: "2021-08-18T09:30:12-05:00"
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
    "lines_on_list": ["PL-14942", "PL-18586", "PL-17872", "PL-10904", "PL-15410"],
    "visit_id": "V-2021-081874"
  }
}
```
