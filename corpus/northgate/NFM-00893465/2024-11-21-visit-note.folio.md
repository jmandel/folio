---
folio: "0.1"
id: "01JD8QYNM0T7Q0YJG5S6XXJFVD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00893465"
effective: "2024-11-21T15:40:00-06:00"
recorded: "2024-11-21T19:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 143/77, repeat 135/73. Pulse 69, wt 167 lb.

Labs today: eGFR 53, K 4.6, LDL 68 mg/dL.

Problem list updated from pt history. RTC for recheck, sooner if concerns.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112124",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-112124",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
