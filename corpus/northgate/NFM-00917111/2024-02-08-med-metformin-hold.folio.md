---
folio: "0.1"
id: "01HP59CJTGE9E85QF65VAN131Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00917111"
effective: "2024-02-08T15:18:00-06:00"
recorded: "2024-02-08T15:18:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold metformin: vomiting, poor oral intake.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-10691",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-02-15"
  }
}
```
