---
folio: "0.1"
id: "01EEFZ0WGGQNQCTA9RV8VWSW4C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00268144"
effective: "2020-07-30T08:36:00-05:00"
recorded: "2020-07-30T08:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Lisinopril increased to 40 mg daily.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-24167",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2020-073079"
  }
}
```
