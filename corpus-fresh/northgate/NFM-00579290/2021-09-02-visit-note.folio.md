---
folio: "0.1"
id: "01FEM9CBV0PF8GM7GH109D0A43"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00579290"
effective: "2021-09-02T11:30:00-05:00"
recorded: "2021-09-02T17:17:00-05:00"
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
Metformin held today (vomiting, poor oral intake), review 9/9.
Pt agrees with plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-090261",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
