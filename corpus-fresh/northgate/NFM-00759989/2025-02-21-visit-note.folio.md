---
folio: "0.1"
id: "01JMN5PHV01PDX4FJC5VKKGRMX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759989"
effective: "2025-02-21T08:45:00-06:00"
recorded: "2025-02-21T15:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no complaints.
BP 128/69, pulse 66, wt 182 lb.
Labs today: eGFR 75, K 4.5, A1c 7.7%, LDL 120 mg/dL.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-022136",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-022136",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
