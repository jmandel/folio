---
folio: "0.1"
id: "01F6G7D8M0AJQRNA2HCF5MPNAD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00032392"
effective: "2021-05-24T15:50:00-05:00"
recorded: "2021-05-24T17:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. HTN and DM2 history per pt.
BP 149/89, repeat 147/86, pulse 88, wt 195 lb.
Labs today: eGFR 87, K 4.4, UACR 205 mg/g, A1c 7%, LDL 112 mg/dL.
Reviewed results with pt. Will recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-052445",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-052445",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-052445",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
