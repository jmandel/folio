---
folio: "0.1"
id: "01FEY8K8SG66JA9232VZ2XY3AS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484397"
effective: "2021-09-06T14:15:00-05:00"
recorded: "2021-09-06T14:15:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold lisinopril: vomiting, poor oral intake.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-24017",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2021-09-13"
  }
}
```
