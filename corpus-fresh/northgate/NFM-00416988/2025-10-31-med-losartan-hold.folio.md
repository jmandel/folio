---
folio: "0.1"
id: "01K8XX4ZJG95S7P3JQKKA71XC3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2025-10-31T14:50:00-05:00"
recorded: "2025-10-31T14:50:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 5.9 confirmed on repeat. Losartan held today, review 2025-11-14.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-14646",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979492" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.9 confirmed on repeat",
    "review_on": "2025-11-14",
    "visit_id": "V-2025-103117"
  }
}
```
