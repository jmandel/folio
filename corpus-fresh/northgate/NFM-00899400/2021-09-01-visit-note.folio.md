---
folio: "0.1"
id: "01FEHMMJG09MK4P46DSEW4K1HP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00899400"
effective: "2021-09-01T14:16:00-05:00"
recorded: "2021-09-01T16:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and not keeping much down.
Poor oral intake. Advised small sips of fluids.
Metformin held today (vomiting, poor oral intake); review 9/8.
Call back or go to ED if vomiting continues or pt can't keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-090186",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
