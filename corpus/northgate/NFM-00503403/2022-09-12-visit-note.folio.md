---
folio: "0.1"
id: "01GCSK3E20EVJ4CPZQTSD3Q4J5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2022-09-12T10:15:00-05:00"
recorded: "2022-09-12T14:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes f/u. Doing OK.
BP 131/79, pulse 69, wt 151 lb.
eGFR 39, K 4.9, A1c 7.4%, LDL 123 mg/dL today.
K a bit higher, will recheck at next visit.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-091218",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-091218",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-091218",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-091218",
    "rank": 3,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2022-091218",
    "rank": 4,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
