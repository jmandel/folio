---
folio: "0.1"
id: "01HQKBYVRGHJP5834BFSN1BSFR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00808670"
effective: "2024-02-26T12:48:00-06:00"
recorded: "2024-02-26T12:48:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Losartan held today for vomiting and poor oral intake.</ref> Review 3/4.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-37829",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-03-04"
  }
}
```
