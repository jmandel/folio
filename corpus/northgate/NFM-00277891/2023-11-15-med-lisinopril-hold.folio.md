---
folio: "0.1"
id: "01HFAD8G8GPVRCJNHZP4AJJEQ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2023-11-15T15:12:00-06:00"
recorded: "2023-11-15T15:12:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold lisinopril: K 5.6 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-19957",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.6 confirmed on repeat",
    "review_on": "2023-11-29",
    "visit_id": "V-2023-111597"
  }
}
```
