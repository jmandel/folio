---
folio: "0.1"
id: "01GHA0JCW02Z0CBYAC7Q4AE43W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00323182"
effective: "2022-11-07T09:50:00-06:00"
recorded: "2022-11-07T15:40:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 141/79, repeat 136/78, pulse 82, wt 214 lb.
Labs 11/5: eGFR 96, K 4.3, A1c 7.8%.
BP above goal, chlorthalidone 12.5 mg daily started today.
RTC 3 mo, BMP then.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-110789",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-110789",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-110789",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-110789",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
