---
folio: "0.1"
id: "01JWCYEMT0V6W8AM1N5RZ689MQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2025-05-28T15:34:00-05:00"
recorded: "2025-05-28T21:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt reports vomiting and poor oral intake.

Metformin held today (vomiting, poor oral intake); review 6/4.

Advised to call sooner if worse or unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-052881",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
