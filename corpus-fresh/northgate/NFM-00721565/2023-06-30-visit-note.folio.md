---
folio: "0.1"
id: "01H46FQ3P0W74T4KQPQ62XRWT9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00721565"
effective: "2023-06-30T08:15:00-05:00"
recorded: "2023-06-30T10:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 151/92, repeat 148/88, pulse 85, wt 212 lb.
Labs 6/25: eGFR 41, K 4.8, UACR 78 mg/g, A1c 7.6%. CKD 3b.
BP above goal, so lisinopril changed to 20 mg daily today.
Continue diet and exercise counseling. RTC 3 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-063091",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-063091",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-063091",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-063091",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
