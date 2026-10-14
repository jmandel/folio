---
folio: "0.1"
id: "01E9BTA91093GMF9SDK6FWGAP1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00083633"
effective: "2020-05-27T08:30:00-05:00"
recorded: "2020-05-27T14:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feeling well.
BP 139/74, pulse 72, wt 150 lb.
Labs 5/25: eGFR 59, K 3.9, UACR 210 mg/g, A1c 7.1%, LDL 94 mg/dL.
Discussed urine albumin result, will repeat labs at next visit.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-052781",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-052781",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-052781",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
