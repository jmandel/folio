---
folio: "0.1"
id: "01JE6YD620WVS4AHG0CREWENDG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531772"
effective: "2024-12-03T10:41:00-06:00"
recorded: "2024-12-03T13:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

metformin: held today (vomiting, poor oral intake); review 2024-12-10

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-120371",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
