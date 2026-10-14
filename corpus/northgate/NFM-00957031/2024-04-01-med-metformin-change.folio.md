---
folio: "0.1"
id: "01HTDPAXVGBTNA28KYJRH9BETP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00957031"
effective: "2024-04-01T15:41:00-05:00"
recorded: "2024-04-01T15:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change metformin: eGFR 44.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30810",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eGFR 44",
    "visit_id": "V-2024-040178"
  }
}
```
