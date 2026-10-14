---
folio: "0.1"
id: "01HPHJ33QGNSWV47ZN9XHNJTTD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00492858"
effective: "2024-02-13T09:41:00-06:00"
recorded: "2024-02-13T09:41:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Metformin increased to 1000 mg BID.</ref> Pt informed.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-26726",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2024-021334"
  }
}
```
