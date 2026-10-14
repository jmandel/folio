---
folio: "0.1"
id: "01J6ZQ05W0ZGA8AP65CT4PSMYE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00040235"
effective: "2024-09-04T13:18:00-05:00"
recorded: "2024-09-04T18:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and not keeping much down.

Metformin held today for vomiting and poor oral intake. Review 9/11.

Advised small sips of fluids. Call back if worse or unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-090475",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
