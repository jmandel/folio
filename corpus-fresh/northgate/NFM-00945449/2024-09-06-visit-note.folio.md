---
folio: "0.1"
id: "01J74HS5Z0ASG5RJNBEHVX3TX2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00945449"
effective: "2024-09-06T12:40:00-05:00"
recorded: "2024-09-06T15:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 137/81, pulse 80, wt 215 lb.
Labs 9/2: eGFR 59, K 4.5, A1c 8.2%, LDL 49.
Dapagliflozin started 10 mg daily today (A1c 8.2).
Problem list built from pt history today.
RTC to recheck labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-090698",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-090698",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-090698",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
