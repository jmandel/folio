---
folio: "0.1"
id: "01JARJ65W060HTPAD3P4MCHNPK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00577826"
effective: "2024-10-21T15:24:00-05:00"
recorded: "2024-10-21T17:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt reports vomiting and not able to keep much down.

Losartan: held today (vomiting, poor oral intake); review 10/28.

Advised small sips of fluids. Call back or come in if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102157",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
