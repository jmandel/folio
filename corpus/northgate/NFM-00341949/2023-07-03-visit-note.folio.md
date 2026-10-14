---
folio: "0.1"
id: "01H4F19CD0Y34XN54TS4PRX1QM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341949"
effective: "2023-07-03T12:40:00-05:00"
recorded: "2023-07-03T18:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 142/83, repeat 138/83, pulse 69, wt 226 lb.
Labs today: eGFR 63, K 4.6, A1c 7.6%.
BP above goal on both readings.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-070382",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-070382",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-070382",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
