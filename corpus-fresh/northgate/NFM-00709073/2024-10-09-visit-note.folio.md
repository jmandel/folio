---
folio: "0.1"
id: "01J9SPJ5R0WYGJNFZRC1PJA5MY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00709073"
effective: "2024-10-09T12:20:00-05:00"
recorded: "2024-10-09T17:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 158/88, pulse 73, wt 229 lb.
Today eGFR 78, K 4.4, UACR 121 mg/g, A1c 7.6%.
BP above goal, losartan dose changed to 100 mg daily today.
Recheck BP and labs at next visit. RTC 2 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-100958",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-100958",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-100958",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-100958",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
