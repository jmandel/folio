---
folio: "0.1"
id: "01GG67ZT301F2CPG815K5J62XP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00871242"
effective: "2022-10-24T15:45:00-05:00"
recorded: "2022-10-24T19:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK, no new complaints.
BP 126/75, pulse 87, wt 136 lb.
Reviewed problem list, no changes today.
Encouraged diet and activity.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-102472",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-102472",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
