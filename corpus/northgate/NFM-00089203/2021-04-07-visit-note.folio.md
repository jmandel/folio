---
folio: "0.1"
id: "01F2QA1P20A93R2NXP38AZRMW9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00089203"
effective: "2021-04-07T13:50:00-05:00"
recorded: "2021-04-07T18:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 153/90, pulse 85, wt 203 lb.
eGFR 66 today, K 4.2. UACR 432 mg/g.
BP above goal, losartan dose changed to 100 mg daily today.
Pt agrees with plan.
RTC for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-040751",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-040751",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-040751",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-040751",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
