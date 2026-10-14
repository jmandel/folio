---
folio: "0.1"
id: "01KM3H2ZC06Y9K84KKKY6NNPS6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00810588"
effective: "2026-03-19T09:15:00-05:00"
recorded: "2026-03-19T12:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK, no new symptoms.

BP 145/89, repeat 140/85, pulse 62, wt 228 lb.

BP above goal, amlodipine 5 mg daily started today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031932",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-031932",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
