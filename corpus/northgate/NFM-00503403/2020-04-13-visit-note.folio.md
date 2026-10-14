---
folio: "0.1"
id: "01E5TQ27R0PQC989RSVM9YAB85"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2020-04-13T10:15:00-05:00"
recorded: "2020-04-13T16:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Pt reports a dry cough that bothers him at night.
BP 132/76, pulse 72, wt 148 lb.
eGFR 43, K 4.5, UACR 559 mg/g, A1c 8.6%, LDL 106 mg/dL today.
Lisinopril stopped today (dry cough). Lisinopril intolerance: dry cough.
Losartan started 50 mg daily today (ACE inhibitor cough).
Dapagliflozin started 10 mg daily today (A1c 8.6, CKD).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-041322",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-041322",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-041322",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-041322",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2020-041322",
    "rank": 4,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
