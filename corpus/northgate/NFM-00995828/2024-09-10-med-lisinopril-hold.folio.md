---
folio: "0.1"
id: "01J7EH5JPGSV77K9DZFC8K14E4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00995828"
effective: "2024-09-10T12:54:00-05:00"
recorded: "2024-09-10T12:54:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril held today for vomiting and poor oral intake.</ref> Review 9/17.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-32420",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 10 MG Oral Tablet", "rxnorm": "314076" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-09-17"
  }
}
```
