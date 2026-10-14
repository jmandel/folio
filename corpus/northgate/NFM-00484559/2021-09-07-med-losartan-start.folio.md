---
folio: "0.1"
id: "01FF0VCSYGRPQ15EY7XE4AAF68"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2021-09-07T14:22:00-05:00"
recorded: "2021-09-07T14:22:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start losartan: ACE inhibitor cough.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-15207",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979485" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "ACE inhibitor cough",
    "visit_id": "V-2021-090736"
  }
}
```
