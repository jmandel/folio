---
folio: "0.1"
id: "01JD3HAMM030SJYF5N7P0YJY5X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00198699"
effective: "2024-11-19T15:20:00-06:00"
recorded: "2024-11-19T19:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt, problem list started.

BP 152/92, repeat 147/88. Pulse 77, wt 131 lb.

BP up on both readings, will recheck at next visit.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111996",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111996",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
