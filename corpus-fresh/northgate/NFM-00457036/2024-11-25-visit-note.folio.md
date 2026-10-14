---
folio: "0.1"
id: "01JDJYCTZ00QVYQACBQW9ZZ4S2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00457036"
effective: "2024-11-25T12:12:00-06:00"
recorded: "2024-11-25T18:37:00-06:00"
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

Metformin held today (vomiting, poor oral intake). Will review 12/2.
Advised to sip fluids and call back if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112511",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
