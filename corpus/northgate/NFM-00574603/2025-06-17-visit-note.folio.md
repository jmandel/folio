---
folio: "0.1"
id: "01JXZAPEA01SJW88BEW5WTX864"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00574603"
effective: "2025-06-17T08:15:00-05:00"
recorded: "2025-06-17T11:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

dapagliflozin: started 10 mg daily today (A1c 8.3)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061741",
    "visit_type": "office",
    "reason": "Chronic care visit"
  }
}
```
