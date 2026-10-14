---
folio: "0.1"
id: "01J92CVW00TQ93BX4PXCE2JB3E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00338283"
effective: "2024-09-30T10:58:00-05:00"
recorded: "2024-09-30T16:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and not keeping much down.

Metformin held today (vomiting, poor oral intake). Review 10/7.

Advised small sips of fluids and to call back or go to the ED if worse or unable to keep liquids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-093068",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
