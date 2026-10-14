---
folio: "0.1"
id: "01F4SVQPV04T941DXQH9VS6PWB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00994489"
effective: "2021-05-03T09:40:00-05:00"
recorded: "2021-05-03T14:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting.
Poor oral intake, not keeping much down.
Lisinopril held today (vomiting, poor oral intake); review 5/10.
Advised small sips of fluids. Call back or go to ED if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-050312",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
