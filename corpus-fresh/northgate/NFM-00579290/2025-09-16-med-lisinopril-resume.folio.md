---
folio: "0.1"
id: "01K59SHEDGK34J4PHVEQXD4QSP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00579290"
effective: "2025-09-16T12:35:00-05:00"
recorded: "2025-09-16T12:35:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Creatinine back to baseline. Lisinopril 40 mg daily resumed today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-13294",
    "action": "resume",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "creatinine back to baseline",
    "visit_id": "V-2025-091622"
  }
}
```
