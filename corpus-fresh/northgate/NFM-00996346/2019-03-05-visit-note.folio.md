---
folio: "0.1"
id: "01D57NVJ102N609T7AD2K99D62"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00996346"
effective: "2019-03-05T10:50:00-06:00"
recorded: "2019-03-05T13:39:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 132/76, pulse 82, wt 193 lb.

Labs 2/27: A1c 8.2%, eGFR 73, K 4.4, LDL 69.

A1c 8.2 so started insulin glargine 10 units at bedtime today.

Reviewed history with pt. RTC for f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-030569",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-030569",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
