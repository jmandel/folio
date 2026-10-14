---
folio: "0.1"
id: "01HQM1YHB0C0XRX88SRYRJSJAV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00808670"
effective: "2024-02-26T12:43:00-06:00"
recorded: "2024-02-26T19:13:00-06:00"
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

losartan: held today (vomiting, poor oral intake); review 2024-03-04

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-022693",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
