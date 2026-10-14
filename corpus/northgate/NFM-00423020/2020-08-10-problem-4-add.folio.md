---
folio: "0.1"
id: "01EFCHPV6089805RWB9T30RRMS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00423020"
effective: "2020-08-10"
recorded: "2020-08-10T11:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19239",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2012-01-01", "precision": "year" },
    "visit_id": "V-2020-081039"
  }
}
```
