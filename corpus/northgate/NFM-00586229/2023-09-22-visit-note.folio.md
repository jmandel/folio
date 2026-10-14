---
folio: "0.1"
id: "01HAZ3MCY0CASBT224SX0T3GQY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00586229"
effective: "2023-09-22T10:50:00-05:00"
recorded: "2023-09-22T13:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt reports dry cough on lisinopril.
Lisinopril stopped today (dry cough). Losartan started 50 mg daily today (ACE inhibitor cough). Lisinopril intolerance: dry cough.
BP 140/84, repeat 136/81, pulse 82, wt 170 lb.
eGFR 55, K 4.4, UACR 58 mg/g, A1c 7.5%, LDL 52 mg/dL today. Chronic kidney disease stage 3a.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092212",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092212",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-092212",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-092212",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2023-092212",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
