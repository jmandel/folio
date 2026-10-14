---
folio: "0.1"
id: "01GMXTKK9GFXYJ7DJDYSP6J0TP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2022-12-22T15:07:00-06:00"
recorded: "2022-12-22T15:07:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">stop lisinopril: angioedema.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-33183",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "angioedema",
    "visit_id": "V-2022-122267"
  }
}
```
