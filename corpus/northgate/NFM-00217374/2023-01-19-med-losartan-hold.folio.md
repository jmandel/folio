---
folio: "0.1"
id: "01GQ5D6HPGEPCTKXR980ZM2GSV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00217374"
effective: "2023-01-19T10:18:00-06:00"
recorded: "2023-01-19T10:18:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold losartan: vomiting, poor oral intake.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-19233",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979485" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2023-01-26"
  }
}
```
