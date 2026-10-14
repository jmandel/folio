---
folio: "0.1"
id: "01F4SB2AFG6HPE04Q7XPW69BPG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00994489"
effective: "2021-05-03T09:45:00-05:00"
recorded: "2021-05-03T09:45:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "med_id": "ML-38604",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2021-05-10"
  }
}
```
