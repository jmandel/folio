---
folio: "0.1"
id: "01E7GAFDS0N5QDBG5CYMB36Q0B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00899321"
effective: "2020-05-04T09:10:00-05:00"
recorded: "2020-05-04T12:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-050435",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-050435",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-050435",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
