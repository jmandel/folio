---
folio: "0.1"
id: "01JV5Q8MA08VHHVDSJNAT67JRP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00045723"
effective: "2025-05-13T12:40:00-05:00"
recorded: "2025-05-13T16:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

Patient ran out of losartan about 3 weeks ago and has not been taking it.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051344",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051344",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-051344",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-051344",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2025-051344",
    "rank": 4,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
