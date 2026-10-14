---
folio: "0.1"
id: "01E799TPQ0P1HCM3ATRSG28B0Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2020-05-01T13:00:00-05:00"
recorded: "2020-05-01T18:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 147/88, repeat 145/88, pulse 75, wt 170 lb.

Labs today: eGFR 68, K 4.5, UACR 60 mg/g, A1c 7.6%.

BP above goal on both readings, will recheck at next visit. Diet and exercise reviewed.

RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-050172",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-050172",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-050172",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-050172",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
