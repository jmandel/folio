---
folio: "0.1"
id: "01H8FGF050B6GM9ANDW7ARDDMJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00563235"
effective: "2023-08-22T14:00:00-05:00"
recorded: "2023-08-22T15:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and not keeping much down.
Advised small sips of fluids and to call if worse.
Losartan held today (vomiting, poor oral intake). Review 8/29.
Pt voiced understanding.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-082224",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
