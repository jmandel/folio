---
folio: "0.1"
id: "01HS9EHTQ0KSEQ929ZJHMSZ4RB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770230"
effective: "2024-03-18T08:40:00-05:00"
recorded: "2024-03-18T13:53:00-05:00"
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
BP 114/63, pulse 81, wt 170 lb.
Labs today: eGFR 57, K 5.3, A1c 8.2%, LDL 137 mg/dL. Chronic kidney disease stage 3a added to problem list.
insulin glargine: started 10 units at bedtime today (A1c 8.2). Reviewed hypoglycemia symptoms.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031875",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031875",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-031875",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-031875",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
