---
folio: "0.1"
id: "01FT719R608V0Y4ZBKSWJBMVG0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2022-01-24T10:00:00-06:00"
recorded: "2022-01-24T15:54:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK, no complaints.
BP 140/79, repeat 137/78, pulse 79, wt 163 lb.
Labs 1/21: eGFR 66, K 4.4, UACR 14 mg/g, A1c 7.8%, LDL 146 mg/dL.
BP and A1c both a bit above goal. Discussed with pt.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-012448",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-012448",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-012448",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
