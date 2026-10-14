---
folio: "0.1"
id: "01E7GWX0Z0D7PHEVTRW7W7FADM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00254529"
effective: "2020-05-04T13:15:00-05:00"
recorded: "2020-05-04T17:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 137/87, pulse 73, wt 172 lb.

Labs 4/29: eGFR 56, K 4.3, UACR 49 mg/g, A1c 8%, LDL 96.

Problem list built from pt's history. Will review labs further at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-050485",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-050485",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-050485",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
