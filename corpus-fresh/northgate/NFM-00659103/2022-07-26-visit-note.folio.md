---
folio: "0.1"
id: "01G8Y1Z680GFMC05YNN036S55H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00659103"
effective: "2022-07-26T10:15:00-05:00"
recorded: "2022-07-26T15:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx of HTN, DM2 and hyperlipidemia per pt.
BP 127/72, pulse 71, wt 171 lb.
Labs today: eGFR 77, K 4.1, A1c 6.4%, LDL 71.
Dapagliflozin started 10 mg daily today, A1c above goal.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-072643",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-072643",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-072643",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
