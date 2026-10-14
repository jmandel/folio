---
folio: "0.1"
id: "01EAFR8ZM0C8EWTRYDJBY301W3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2020-06-10T10:02:00-05:00"
recorded: "2020-06-10T13:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting, not keeping much down.
Losartan held today (vomiting, poor oral intake); review 6/17.
Advised small sips of fluids. Call back or come in if worse or unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-061094",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
