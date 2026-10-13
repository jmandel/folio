---
folio: "0.1"
id: "01K97NDEBRAV4RRXG07HN7JVAX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2025-11-04T08:47:55-06:00"
recorded: "2025-11-04T08:47:55-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
retracts:
  - "01K95NT4FGX9G8FGVSQE8Z5379"
---
Atorvastatin 80 mg start on 11/3 was entered on the wrong chart. Not this patient's order. Atorvastatin 40 mg unchanged.

```json payload
{
  "void_1": {
    "type": "chart_correction",
    "voided_items": ["01K95NT4FGX9G8FGVSQE8Z5379"],
    "reason": "wrong_patient"
  }
}
```
