---
folio: "0.1"
id: "01E6M9H35GVE7FBMPC3R1H3T3E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00259527"
effective: "2020-04-23T14:51:00-05:00"
recorded: "2020-04-23T14:51:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change lisinopril: BP above goal.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-19697",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2020-042328"
  }
}
```
