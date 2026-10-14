---
folio: "0.1"
id: "01FE2Q9XE0CKGBBQ0MEXWGD7QQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625829"
effective: "2021-08-26T15:30:00-05:00"
recorded: "2021-08-26T21:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feeling well, no new complaints.

BP 147/90, repeat 143/89, pulse 75, wt 180 lb. BP above goal, losartan increased to 100 mg daily today.

Labs today: eGFR 64, K 4.3, UACR 11 mg/g, A1c 7.8%.

Recheck BP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-082654",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-082654",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-082654",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-082654",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
