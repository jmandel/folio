---
folio: "0.1"
id: "01JCK90VN0DS8K8X7FH075VQD0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00492858"
effective: "2024-11-13T09:40:00-06:00"
recorded: "2024-11-13T11:27:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "visit_id": "V-2024-111348",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111348",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-111348",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
