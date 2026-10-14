---
folio: "0.1"
id: "01JWCD5NG0GAQYNHFZ51Y6GEY2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2025-05-28T12:11:00-05:00"
recorded: "2025-05-28T16:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting, not keeping much down.
Metformin held today (vomiting, poor oral intake); review 6/4.
Advised small sips of fluids. Call back or go to ED if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-052867",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
