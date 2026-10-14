---
folio: "0.1"
id: "01GK03JXDGPF9NT4B6C1N3CXW4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00586229"
effective: "2022-11-28T15:51:00-06:00"
recorded: "2022-11-28T15:51:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold lisinopril: K 5.6 confirmed on repeat.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-48698",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.6 confirmed on repeat",
    "review_on": "2022-12-12",
    "visit_id": "V-2022-112819"
  }
}
```
