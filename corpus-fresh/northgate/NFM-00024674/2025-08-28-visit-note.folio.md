---
folio: "0.1"
id: "01K3SP6YY02GAVFG1EG3Y59KSN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00024674"
effective: "2025-08-28T13:50:00-05:00"
recorded: "2025-08-28T20:14:00-05:00"
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
Metformin: held today (vomiting, poor oral intake); review 9/4.
Advised small sips of fluids. Call back or go to ED if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-082826",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
