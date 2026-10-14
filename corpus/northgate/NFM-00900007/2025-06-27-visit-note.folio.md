---
folio: "0.1"
id: "01JYSE3V20Z8TJS26NF8VR6H4T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900007"
effective: "2025-06-27T12:20:00-05:00"
recorded: "2025-06-27T14:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

<ref id="sick_day">Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink.</ref>

dulaglutide: started 0.5 mg weekly today (A1c 8.3)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-062787",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-062787",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-062787",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-062787",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2025-062787",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_5": {
    "type": "billing_dx",
    "visit_id": "V-2025-062787",
    "rank": 5,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
