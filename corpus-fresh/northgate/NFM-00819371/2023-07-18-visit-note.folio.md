---
folio: "0.1"
id: "01H5NKTCJ015GE8DF2MWJECZ68"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00819371"
effective: "2023-07-18T15:29:00-05:00"
recorded: "2023-07-18T18:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feeling better, vomiting resolved.

Eating and drinking normally.

Lisinopril: resumed today (eating and drinking normally).

Pt to call with any problems.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-071836",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
