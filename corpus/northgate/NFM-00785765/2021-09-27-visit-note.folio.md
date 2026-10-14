---
folio: "0.1"
id: "01FGMBDJ4044FAAMPAHKT616PE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2021-09-27T10:20:00-05:00"
recorded: "2021-09-27T14:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 145/83, repeat 142/82, pulse 74, wt 221 lb.
Today: eGFR 64, K 4.1, A1c 8.1%.
A1c 8.1, so metformin changed to 1000 mg twice daily today. BP above goal, lisinopril changed to 40 mg daily today.
RTC 3 mo, recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092793",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092793",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-092793",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-092793",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2021-092793",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
