---
folio: "0.1"
id: "01JQ4Z6MYGZFS8YN71YMPYQJJW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00000587"
effective: "2025-03-24T15:58:00-05:00"
recorded: "2025-03-24T15:58:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 6.2 confirmed on repeat. Spironolactone 25 mg held.</ref> Review 4/7.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-19952",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.2 confirmed on repeat",
    "review_on": "2025-04-07",
    "visit_id": "V-2025-032424"
  }
}
```
