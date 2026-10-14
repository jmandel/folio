---
folio: "0.1"
id: "01HEBCQ12GVK7JJAHCFGPJQHEW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00857814"
effective: "2023-11-03T15:06:00-05:00"
recorded: "2023-11-03T15:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 5.7 confirmed on repeat. Lisinopril 20 mg daily held.</ref> Review 11/17.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-12798",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 5.7 confirmed on repeat",
    "review_on": "2023-11-17",
    "visit_id": "V-2023-110349"
  }
}
```
