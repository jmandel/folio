---
folio: "0.1"
id: "01H7K8AGA0T23VMS8VQ20YXAGW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2023-08-11T11:00:00-05:00"
recorded: "2023-08-11T16:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No hypoglycemia, no new symptoms.
BP 135/81, pulse 73, wt 212 lb.
Today eGFR 72, K 4, A1c 7.4%.
A1c a bit better than last. Wt stable.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-081136",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-081136",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
