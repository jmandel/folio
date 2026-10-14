---
folio: "0.1"
id: "01G908J5BGG1KM4C9AFGVX0C1P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00801357"
effective: "2022-07-27T11:41:00-05:00"
recorded: "2022-07-27T11:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Lisinopril increased to 20 mg daily.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-26957",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2022-072716"
  }
}
```
