---
folio: "0.1"
id: "01E8CBZGR018W4RMSDY1VCG17N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00487681"
effective: "2020-05-15"
recorded: "2020-05-15T09:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism, since 2012 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19493",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "snomed": "40930008",
    "onset": { "date": "2012-01-01", "precision": "year" },
    "visit_id": "V-2020-051516"
  }
}
```
