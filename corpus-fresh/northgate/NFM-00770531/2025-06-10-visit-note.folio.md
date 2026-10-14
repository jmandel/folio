---
folio: "0.1"
id: "01JXDFZG80VEYE526FR8TF1PQ6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770531"
effective: "2025-06-10T10:09:00-05:00"
recorded: "2025-06-10T13:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting and not keeping much down.

Metformin held today (vomiting, poor oral intake); review 6/17.

Advised small sips of fluids. Call back or go to ED if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061068",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
