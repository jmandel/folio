---
folio: "0.1"
id: "01GAHKF090RESEVTSWR1CWBG15"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2022-08-15T11:40:00-05:00"
recorded: "2022-08-15T15:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing OK overall.
BP 140/90, repeat 133/87, pulse 68, wt 189 lb.
Today: A1c 8.3%, eGFR 57, K 4.2, UACR 322 mg/g, LDL 150.
Started insulin glargine 10 units at bedtime today for A1c 8.3. Pt taught pen use and low sugar signs.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-081561",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-081561",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-081561",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-081561",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
