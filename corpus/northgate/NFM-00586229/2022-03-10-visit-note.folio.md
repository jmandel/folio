---
folio: "0.1"
id: "01FXTMHKH04C35GCDJ0P12RJBS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00586229"
effective: "2022-03-10T11:00:00-06:00"
recorded: "2022-03-10T13:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-031045",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-031045",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-031045",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-031045",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
