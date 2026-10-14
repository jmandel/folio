---
folio: "0.1"
id: "01DME8V3FG4X69THY6XAZ1Z286"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2019-09-10T14:01:00-05:00"
recorded: "2019-09-10T14:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "med_id": "ML-12038",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2019-091084"
  }
}
```
