---
folio: "0.1"
id: "01H2TYV11G1A8FAWGRS2067VV4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00438305"
effective: "2023-06-13T13:03:00-05:00"
recorded: "2023-06-13T13:03:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril stopped today, angioedema.</ref> Pt told not to take any more.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23731",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 10 MG Oral Tablet", "rxnorm": "314076" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "angioedema",
    "visit_id": "V-2023-061359"
  }
}
```
