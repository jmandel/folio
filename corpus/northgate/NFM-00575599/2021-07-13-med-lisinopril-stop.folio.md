---
folio: "0.1"
id: "01FAGP7B7GB1R6DFN6HK6GA28K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00575599"
effective: "2021-07-13T14:41:00-05:00"
recorded: "2021-07-13T14:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">stop lisinopril: dry cough.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-16086",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "dry cough",
    "visit_id": "V-2021-071327"
  }
}
```
