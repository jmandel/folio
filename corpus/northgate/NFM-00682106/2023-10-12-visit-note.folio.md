---
folio: "0.1"
id: "01HCJVH9F07CQ2DXTPN4FMPVSD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00682106"
effective: "2023-10-12T13:35:00-05:00"
recorded: "2023-10-12T16:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

metformin: held today (vomiting, poor oral intake); review 2023-10-19

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-101245",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
