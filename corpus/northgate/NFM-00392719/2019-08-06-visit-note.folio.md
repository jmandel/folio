---
folio: "0.1"
id: "01DHMFZWN0QWVHQKKVVX0E49NJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2019-08-06T10:45:00-05:00"
recorded: "2019-08-06T17:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 133/78, pulse 66, wt 209 lb.

Labs 8/4: eGFR 44, K 4.7, A1c 9.2%.

Metformin changed to 500 mg BID today given eGFR 42. Started dapagliflozin 10 mg daily (A1c 9.2, CKD).

Records requested. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-080672",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-080672",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
