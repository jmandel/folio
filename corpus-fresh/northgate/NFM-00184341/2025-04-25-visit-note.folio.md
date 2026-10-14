---
folio: "0.1"
id: "01JSQ6G840QZ2ZSCAW99ZFDVH4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00184341"
effective: "2025-04-25T09:18:00-05:00"
recorded: "2025-04-25T14:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting, not keeping much down.
Poor oral intake. Advised small sips of fluids.
Losartan held today (vomiting, poor oral intake), review 5/2.
Pt to call or go to ED if worse or unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-042578",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
