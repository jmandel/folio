---
folio: "0.1"
id: "01F1DTMW8090SPAKS9WJXBAHY0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2021-03-22T09:10:00-05:00"
recorded: "2021-03-22T15:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no complaints.
BP 147/91, repeat 143/87, pulse 81, wt 160 lb.
eGFR 67, K 4.4, UACR 13 mg/g, A1c 7% today.
BP above goal today, will watch at home and recheck.
RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-032263",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-032263",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-032263",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
