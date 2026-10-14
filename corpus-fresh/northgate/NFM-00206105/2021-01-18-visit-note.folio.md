---
folio: "0.1"
id: "01EWBM7QS0E172FD8747Q23KEZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00206105"
effective: "2021-01-18T09:45:00-06:00"
recorded: "2021-01-18T14:51:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no hypoglycemia symptoms.

BP 136/81, pulse 78, wt 172 lb.
Labs today: eGFR 100, K 4.3, A1c 7.3%, LDL 56 mg/dL.

Results reviewed with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-011845",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-011845",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-011845",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
