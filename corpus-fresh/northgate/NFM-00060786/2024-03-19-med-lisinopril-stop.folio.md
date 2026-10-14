---
folio: "0.1"
id: "01HSBJ7DHGS2KR3QV46NVQ19QR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00060786"
effective: "2024-03-19T09:35:00-05:00"
recorded: "2024-03-19T09:35:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril stopped today, AKI with hyperkalemia.</ref> Pt informed.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43423",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 10 MG Oral Tablet", "rxnorm": "314076" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "AKI with hyperkalemia",
    "visit_id": "V-2024-031995"
  }
}
```
