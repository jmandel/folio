---
folio: "0.1"
id: "01H14ZDVX0EXBQFSEAWA7FQ18W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00273200"
effective: "2023-05-23T10:00:00-05:00"
recorded: "2023-05-23T13:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. History per pt.
BP 142/81, repeat 135/77, pulse 62, wt 105 lb.
Labs today: eGFR 63, K 4.6, A1c 6.9%, LDL 137 mg/dL.
A1c above goal, empagliflozin started 10 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-052373",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-052373",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-052373",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
