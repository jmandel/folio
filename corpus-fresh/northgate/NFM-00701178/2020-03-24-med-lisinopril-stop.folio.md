---
folio: "0.1"
id: "01E46QBRWGVN1P8Z6WVR23NXDB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701178"
effective: "2020-03-24T11:52:00-05:00"
recorded: "2020-03-24T11:52:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Dry cough. Lisinopril stopped today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-39849",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "dry cough",
    "visit_id": "V-2020-032479"
  }
}
```
