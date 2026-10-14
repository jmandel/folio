---
folio: "0.1"
id: "01J3G6EEN0YH5JY4EDX75Q1YBP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493884"
effective: "2024-07-23T08:30:00-05:00"
recorded: "2024-07-23T11:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 145/89, repeat 141/85. Pulse 70, wt 185 lb.

BP elevated on both readings, will recheck at next visit.

RTC in a few weeks.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-072368",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-072368",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-072368",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
