---
folio: "0.1"
id: "01D5AC6M00TYVKT4XCS169SHD9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493571"
effective: "2019-03-06T08:30:00-06:00"
recorded: "2019-03-06T14:48:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 143/86, repeat 138/84, pulse 86, wt 166 lb.
Labs today: eGFR 54, K 4.5, UACR 72 mg/g, A1c 8.2%, LDL 66.
Metformin increased to 1000 mg BID today for A1c 8.2.
Will recheck labs at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-030683",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-030683",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-030683",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
