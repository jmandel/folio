---
folio: "0.1"
id: "01GPEW5ZE0JE4TPYA4G7GPD23K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00623675"
effective: "2023-01-10T13:50:00-06:00"
recorded: "2023-01-10T16:18:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 147/86, repeat 141/83. Pulse 85, wt 139 lb.
Labs today: eGFR 49, K 4.5, A1c 7.3%, LDL 122 mg/dL.
Problem list built from pt history. Will recheck labs and BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011017",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-011017",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-011017",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
