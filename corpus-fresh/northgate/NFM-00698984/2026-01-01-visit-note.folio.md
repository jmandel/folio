---
folio: "0.1"
id: "01KDXW00V06JS5AZCHS0J72PH4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00698984"
effective: "2026-01-01T11:02:00-06:00"
recorded: "2026-01-01T16:49:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting, poor oral intake.
Metformin held today (vomiting, poor oral intake); review 1/8.
Advised small sips of fluids, call back or go to ED if unable to keep fluids down or worsening.
Pt voiced understanding.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-010194",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
