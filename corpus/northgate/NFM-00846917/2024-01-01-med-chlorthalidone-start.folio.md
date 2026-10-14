---
folio: "0.1"
id: "01HK37K1BG5FPVG0G69HHNGRMC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00846917"
effective: "2024-01-01T13:21:00-06:00"
recorded: "2024-01-01T13:21:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Chlorthalidone 12.5 mg daily started today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23146",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "chlorthalidone 25 MG Oral Tablet", "rxnorm": "197499" },
    "dose": { "value": 12.5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1/2 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2024-010124"
  }
}
```
