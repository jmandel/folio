---
folio: "0.1"
id: "01GSVDJN807ATTFW3J5NAFT75Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00561860"
effective: "2023-02-21T15:45:00-06:00"
recorded: "2023-02-21T20:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 149/86, pulse 65, wt 223 lb.
Labs today: eGFR 84, K 4.6, UACR 7 mg/g, A1c 6.8%, LDL 139 mg/dL.
Problem list built from pt's history. Records requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-022153",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-022153",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-022153",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
