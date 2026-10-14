---
folio: "0.1"
id: "01EPZ62AA0MMXKKEFKC9309K47"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172130"
effective: "2020-11-12T10:45:00-06:00"
recorded: "2020-11-12T15:34:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Labs from 11/6 reviewed: A1c 8.1%, eGFR 45, K 4.4, UACR 69 mg/g, LDL 136.
BP 148/84, repeat 146/83. Pulse 62, wt 219 lb.
Metformin dose changed to 1000 mg twice daily today (A1c 8.1).
Discussed diet and activity. Will recheck labs at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-111269",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-111269",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-111269",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-111269",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
