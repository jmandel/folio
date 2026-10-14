---
folio: "0.1"
id: "01KHQBNHD0GFZ6MK325NS6KBCN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00891028"
effective: "2026-02-17T15:27:00-06:00"
recorded: "2026-02-17T21:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and can't keep much down.
Poor oral intake. Losartan held today (vomiting, poor oral intake); review 2/24.
Advised small sips of fluids. Call back or go to ED if worse or unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021722",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
