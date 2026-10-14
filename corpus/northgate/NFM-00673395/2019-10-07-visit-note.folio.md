---
folio: "0.1"
id: "01DPKWJ8Y099M5GKVF8ZC517TC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673395"
effective: "2019-10-07T10:45:00-05:00"
recorded: "2019-10-07T14:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-100779",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
