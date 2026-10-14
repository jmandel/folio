---
folio: "0.1"
id: "01JY2Q2EW09V1F48JYBFFXXEZN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00334426"
effective: "2025-06-18T12:26:00-05:00"
recorded: "2025-06-18T18:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting, not eating or drinking much.
Metformin held today (vomiting, poor oral intake); review 6/25.
Advised small sips of fluids. Call back or go to ED if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061837",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
