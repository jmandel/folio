---
folio: "0.1"
id: "01G4ZBWZ206M852YVP60CR4QYD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00861057"
effective: "2022-06-07T08:20:00-05:00"
recorded: "2022-06-07T10:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records reviewed with pt.
BP 152/94, repeat 147/94. Pulse 79, wt 160 lb.
Labs 6/2: eGFR 72, K 4.5.
Discussed home BP checks, diet and activity.
RTC to recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-060757",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-060757",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
