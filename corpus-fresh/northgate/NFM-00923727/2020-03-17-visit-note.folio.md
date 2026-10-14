---
folio: "0.1"
id: "01E3NHE1Y0YZF0VH7NFJY8VCX6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00923727"
effective: "2020-03-17T14:30:00-05:00"
recorded: "2020-03-17T19:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 143/84, pulse 78, wt 213 lb.

Labs 3/13: eGFR 77, K 4.5, A1c 7.8%, LDL 64 mg/dL.

Problem list entered from pt history. RTC after next labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-031711",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-031711",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-031711",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
