---
folio: "0.1"
id: "01JC6JZPD0G527VX1RYJAKSBAM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00298630"
effective: "2024-11-08T09:56:00-06:00"
recorded: "2024-11-08T13:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt reports vomiting and not able to keep much down.
Poor oral intake, advised small sips of fluids.
Metformin held today (vomiting, poor oral intake), review 11/15.
Call back or go to ED if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-110885",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
