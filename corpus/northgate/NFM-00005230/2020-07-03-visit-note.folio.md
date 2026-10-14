---
folio: "0.1"
id: "01ECBQ3JE03MP15V5QVRB4ZYZZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00005230"
effective: "2020-07-03T14:10:00-05:00"
recorded: "2020-07-03T20:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 144/87, pulse 69, wt 185 lb.
Labs today: eGFR 70, K 4.4, A1c 7.6%, LDL 58 mg/dL.
BP above goal, lisinopril dose changed to 20 mg daily today.
Pt agrees with plan.
RTC to recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-070367",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-070367",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-070367",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
