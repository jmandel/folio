---
folio: "0.1"
id: "01HFA7FJ9G4PW52EVAT22HG7CR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2023-11-15T13:31:00-06:00"
recorded: "2023-11-15T13:31:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Losartan 50 mg daily started.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30129",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979492" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2023-111547"
  }
}
```
