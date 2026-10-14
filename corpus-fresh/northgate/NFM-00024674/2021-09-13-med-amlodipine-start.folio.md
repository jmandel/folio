---
folio: "0.1"
id: "01FFG095CGNWC9DMFFBDPCHRZ0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00024674"
effective: "2021-09-13T11:36:00-05:00"
recorded: "2021-09-13T11:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Amlodipine started 5 mg daily today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-32836",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 5 MG Oral Tablet", "rxnorm": "197361" },
    "dose": { "value": 5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2021-091328"
  }
}
```
