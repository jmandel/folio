---
folio: "0.1"
id: "01JEVQ0AWGA1B1J7G3WSCEG86D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00032392"
effective: "2024-12-11T14:36:00-06:00"
recorded: "2024-12-11T14:36:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril increased to 20 mg daily, BP above goal.</ref> Pt informed.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-13677",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2024-121153"
  }
}
```
