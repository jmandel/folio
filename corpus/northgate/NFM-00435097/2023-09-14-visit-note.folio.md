---
folio: "0.1"
id: "01HAAMETG0QYPWZ7JA01AW9A4A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00435097"
effective: "2023-09-14T10:58:00-05:00"
recorded: "2023-09-14T15:00:00-05:00"
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

metformin: held today (vomiting, poor oral intake); review 2023-09-21

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-091412",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
