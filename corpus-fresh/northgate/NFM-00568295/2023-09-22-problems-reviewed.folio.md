---
folio: "0.1"
id: "01HAYSMAR0PR9SHVJKX0GJ6BYF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2023-09-22T10:55:00-05:00"
recorded: "2023-09-22T10:55:12-05:00"
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
    "lines_on_list": ["PL-13612", "PL-18488", "PL-18014", "PL-13935"],
    "visit_id": "V-2023-092219"
  }
}
```
