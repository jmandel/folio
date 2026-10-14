---
folio: "0.1"
id: "01J01R3PG031JQKEY08HAK9B1C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2024-06-10T09:49:00-05:00"
recorded: "2024-06-10T13:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt reports vomiting and poor oral intake since yesterday. Able to keep down small sips.

Metformin held today (vomiting, poor oral intake); review 6/17.

Advised fluids as tolerated. Call back or go to ED if unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-061085",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
