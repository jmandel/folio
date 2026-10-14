---
folio: "0.1"
id: "01HX09FHY0QR03C2SVFGKMDY5V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00323182"
effective: "2024-05-03T15:20:00-05:00"
recorded: "2024-05-03T17:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

metformin: held today (vomiting, poor oral intake); review 2024-05-10

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-050348",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
