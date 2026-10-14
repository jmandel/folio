---
folio: "0.1"
id: "01J7ES2T70KNSEFNXP9E442EWP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00995828"
effective: "2024-09-10T12:49:00-05:00"
recorded: "2024-09-10T15:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting. Poor oral intake, trouble keeping fluids down.
Advised small sips and rest.
Lisinopril: held today (vomiting, poor oral intake); review 9/17.
Call back or seek care if worse or unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091049",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
