---
folio: "0.1"
id: "01GMXTNDWG6G6KV43FRTCY22YQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2022-12-22T15:08:00-06:00"
recorded: "2022-12-22T15:08:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start amlodipine: replacing lisinopril (angioedema).</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-33812",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "amlodipine 5 MG Oral Tablet", "rxnorm": "197361" },
    "dose": { "value": 5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "replacing lisinopril (angioedema)",
    "visit_id": "V-2022-122235"
  }
}
```
