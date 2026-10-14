---
folio: "0.1"
id: "01KEWNG90089HG8JS8MZ2JBN1N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701971"
effective: "2026-01-13T10:00:00-06:00"
recorded: "2026-01-13T15:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no new concerns.

BP 126/78, pulse 84, wt 218 lb.
Labs today: eGFR 90, K 4.4, LDL 100 mg/dL.

BP at goal. LDL up from last check, discussed diet and exercise.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-011398",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-011398",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-011398",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
