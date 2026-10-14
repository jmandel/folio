---
folio: "0.1"
id: "01FSAA6SSGKXCPAPBWHDF2PV2P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2022-01-13T12:11:00-06:00"
recorded: "2022-01-13T12:11:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Chlorthalidone 12.5 mg daily started.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-38820",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "chlorthalidone 25 MG Oral Tablet", "rxnorm": "197499" },
    "dose": { "value": 12.5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1/2 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2022-011336"
  }
}
```
