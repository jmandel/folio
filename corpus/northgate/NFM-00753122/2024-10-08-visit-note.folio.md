---
folio: "0.1"
id: "01J9Q8SRV09BBH55MGEYS958XV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00753122"
effective: "2024-10-08T14:02:00-05:00"
recorded: "2024-10-08T18:53:00-05:00"
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

lisinopril: held today (vomiting, poor oral intake); review 2024-10-15

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-100882",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
