---
folio: "0.1"
id: "01DDY14GQ09HMM3JJ7ZNTRHHSZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00767475"
effective: "2019-06-21T12:40:00-05:00"
recorded: "2019-06-21T17:05:00-05:00"
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
    "visit_id": "V-2019-062176",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-062176",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
