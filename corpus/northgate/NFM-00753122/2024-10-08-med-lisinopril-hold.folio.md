---
folio: "0.1"
id: "01J9PRFC1GBY67JN8VTVG948PB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00753122"
effective: "2024-10-08T14:07:00-05:00"
recorded: "2024-10-08T14:07:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold lisinopril: vomiting, poor oral intake.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-12078",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 10 MG Oral Tablet", "rxnorm": "314076" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-10-15"
  }
}
```
