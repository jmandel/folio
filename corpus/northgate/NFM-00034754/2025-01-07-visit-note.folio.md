---
folio: "0.1"
id: "01JH1GQRP0K0DZ215N1RDW3SVT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034754"
effective: "2025-01-07T13:45:00-06:00"
recorded: "2025-01-07T17:14:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no new complaints.

BP 130/80, pulse 63, wt 205 lb.

Labs 1/3: eGFR 64, K 4.3, A1c 7.2%.

Reviewed diet and activity. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-010772",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-010772",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
