---
folio: "0.1"
id: "01EH3ATPG0YMAPSB78GNCHE7A1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2020-08-31T15:30:00-05:00"
recorded: "2020-08-31T17:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 150/87, pulse 88, wt 173 lb.
Today: eGFR 38, K 4.3, UACR 11 mg/g, A1c 7.3%, LDL 63 mg/dL.
Added CKD stage 3b to problem list.
Lisinopril dose changed to 20 mg daily today (BP above goal).
Recheck BP and labs at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-083166",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-083166",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-083166",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-083166",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2020-083166",
    "rank": 4,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
