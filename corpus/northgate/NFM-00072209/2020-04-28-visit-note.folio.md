---
folio: "0.1"
id: "01E712X0E0VSZDWYQ2CPAH8AS3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2020-04-28T08:00:00-05:00"
recorded: "2020-04-28T14:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

metformin: dose changed to 500 mg twice daily today (eGFR 40)

insulin glargine: started 10 units at bedtime today (A1c 8.4)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-042866",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-042866",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
