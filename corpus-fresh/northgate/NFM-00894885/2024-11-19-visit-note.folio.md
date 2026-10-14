---
folio: "0.1"
id: "01JD3NEFC0ZBX1YXP8PEGV9HJ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00894885"
effective: "2024-11-19T15:15:00-06:00"
recorded: "2024-11-19T20:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 125/76, pulse 84, wt 173 lb.
Labs today: eGFR 69, K 4.5, A1c 8%, LDL 111.
A1c above goal, so dapagliflozin started 10 mg daily today.
Reviewed history with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111914",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111914",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-111914",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
