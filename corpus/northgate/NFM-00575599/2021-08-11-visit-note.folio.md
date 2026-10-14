---
folio: "0.1"
id: "01FCVKAE6099QZJZMVMJJZN49W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00575599"
effective: "2021-08-11T11:00:00-05:00"
recorded: "2021-08-11T16:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

losartan: held today (vomiting, poor oral intake); review 2021-08-18

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-081124",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
