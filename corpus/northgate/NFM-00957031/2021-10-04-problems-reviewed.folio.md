---
folio: "0.1"
id: "01FH6D48B0VRWDJR4TEGV3K5VG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00957031"
effective: "2021-10-04T14:40:00-05:00"
recorded: "2021-10-04T14:40:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "lines_on_list": ["PL-19966", "PL-11379", "PL-15738", "PL-13756", "PL-9810"],
    "visit_id": "V-2021-100446"
  }
}
```
