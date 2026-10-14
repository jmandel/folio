---
folio: "0.1"
id: "01JV5M3XN0CJS54228QR6Z6TJD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00560147"
effective: "2025-05-13T13:12:00-05:00"
recorded: "2025-05-13T15:07:00-05:00"
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

losartan: held today (vomiting, poor oral intake); review 2025-05-20

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051377",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
