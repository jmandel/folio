---
folio: "0.1"
id: "01JCHB5FT0FK9E8QFPA266EAMV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00223606"
effective: "2024-11-12T14:40:00-06:00"
recorded: "2024-11-12T17:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.

BP 147/90, repeat 140/89. Pulse 76, wt 202 lb.

Labs 11/10: eGFR 65, K 4.2.

Went over chart with pt, will recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111229",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111229",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
