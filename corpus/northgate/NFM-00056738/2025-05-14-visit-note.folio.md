---
folio: "0.1"
id: "01JV86VM709WTPF83EGW29AXAH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00056738"
effective: "2025-05-14T09:23:00-05:00"
recorded: "2025-05-14T15:13:00-05:00"
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

lisinopril: held today (vomiting, poor oral intake); review 2025-05-21

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051461",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
