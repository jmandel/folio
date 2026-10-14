---
folio: "0.1"
id: "01GW7TKZX0T1QV0SRFWWX5R23A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00768389"
effective: "2023-03-23T13:10:00-05:00"
recorded: "2023-03-23T13:10:12-05:00"
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
    "list": "medications",
    "lines_on_list": ["ML-22392", "ML-18455", "ML-46548", "ML-21709"],
    "visit_id": "V-2023-032373"
  }
}
```
