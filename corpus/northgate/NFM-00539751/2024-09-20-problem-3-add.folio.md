---
folio: "0.1"
id: "01J87ZTVG0V2QJ2G4RYRTH4YCX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00539751"
effective: "2024-09-20"
recorded: "2024-09-20T10:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee, onset 7/2019, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15411",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2019-07-01", "precision": "day" },
    "visit_id": "V-2024-092058"
  }
}
```
