---
folio: "0.1"
id: "01K59Z1S00W58BECGBJKR9KFZ4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00430554"
effective: "2025-09-16T10:02:00-05:00"
recorded: "2025-09-16T14:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and poor oral intake.

Metformin held today. Review 9/23.

Advised small sips of fluids. Call back or go to ED if unable to keep fluids down or getting worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091651",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
