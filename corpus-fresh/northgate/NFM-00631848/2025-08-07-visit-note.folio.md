---
folio: "0.1"
id: "01K238MZJ0T1FKJFE51Z06M2NB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2025-08-07T12:30:00-05:00"
recorded: "2025-08-07T16:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new complaints.
BP 127/76, pulse 73, wt 221 lb.
eGFR 73, K 4 today.
Reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-080767",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-080767",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
