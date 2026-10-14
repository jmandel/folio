---
folio: "0.1"
id: "01KJRTWQ00XHCE441TRFK369DJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2026-03-02T15:19:00-06:00"
recorded: "2026-03-02T21:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and poor oral intake.
Advised small sips of fluids and to call back if worse.
Metformin held today (vomiting, poor oral intake); review 3/9.
Pt voiced understanding.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-030275",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
