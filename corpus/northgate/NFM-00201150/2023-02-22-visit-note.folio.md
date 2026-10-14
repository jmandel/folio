---
folio: "0.1"
id: "01GSXHAM80X6P0GDDF9D79B6AJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2023-02-22T13:33:00-06:00"
recorded: "2023-02-22T15:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

metformin: held today (vomiting, poor oral intake); review 2023-03-01

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-022251",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
