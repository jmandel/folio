---
folio: "0.1"
id: "01DBDKK070K8RM2W3WJKK87DNQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2019-05-21T08:15:00-05:00"
recorded: "2019-05-21T11:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt, entered on problem list.
BP 129/82, pulse 81, wt 212 lb.
Labs 5/18: eGFR 51, K 4.5, UACR 49 mg/g, A1c 7.9%, LDL 76 mg/dL.
Will repeat labs and recheck kidney numbers at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-052136",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-052136",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-052136",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
