---
folio: "0.1"
id: "01ER095A10G4EA7X8E7DCG1QYX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00923727"
effective: "2020-11-25T10:10:00-06:00"
recorded: "2020-11-25T12:03:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 133/81, pulse 81, wt 213 lb.

Labs 11/22: eGFR 76, K 4.8, A1c 8.4%.

Metformin: dose changed to 1000 mg twice daily today (A1c 8.4).

Lisinopril stopped today (dry cough), lisinopril intolerance: dry cough. Losartan started 50 mg daily today (ACE inhibitor cough).

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-112586",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-112586",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-112586",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-112586",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
