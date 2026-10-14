---
folio: "0.1"
id: "01GFBY8EEGDSKG4JYZB2MN2PF6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00920167"
effective: "2022-10-14T14:06:00-05:00"
recorded: "2022-10-14T14:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Amlodipine 5 mg daily started today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-33750",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 5 MG Oral Tablet", "rxnorm": "197361" },
    "dose": { "value": 5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2022-101494"
  }
}
```
