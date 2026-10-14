---
folio: "0.1"
id: "01K2YTET8GAKGTA4SCX9CZ04YF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2025-08-18T09:48:00-05:00"
recorded: "2025-08-18T09:48:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Losartan increased to 100 mg daily today, BP above goal with albuminuria.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-21170",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal with albuminuria",
    "visit_id": "V-2025-081811"
  }
}
```
