---
folio: "0.1"
id: "01JQF2YRCG3HEQG5YX2QKS9PT3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00478850"
effective: "2025-03-28T14:16:00-05:00"
recorded: "2025-03-28T14:16:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 6.2 confirmed on repeat. Lisinopril held.</ref> Review 4/11.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-48288",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 10 MG Oral Tablet", "rxnorm": "314076" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.2 confirmed on repeat",
    "review_on": "2025-04-11",
    "visit_id": "V-2025-032883"
  }
}
```
