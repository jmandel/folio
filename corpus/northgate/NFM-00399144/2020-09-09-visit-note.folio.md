---
folio: "0.1"
id: "01EHTC7G507YSMMJEENY14AH27"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00399144"
effective: "2020-09-09T13:30:00-05:00"
recorded: "2020-09-09T16:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 119/73, pulse 67, wt 200 lb.
Labs 9/4: eGFR 65, K 4, A1c 6.8%, LDL 92.
Problem list started today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-090966",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-090966",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
