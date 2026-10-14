---
folio: "0.1"
id: "01GSEBVYW07ZPRKDX88X7WQHQB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00857814"
effective: "2023-02-16T15:00:00-06:00"
recorded: "2023-02-16T18:20:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 137/85, pulse 62, wt 204 lb.
Labs 2/14: eGFR 61, K 4.5, UACR 190 mg/g.
Problem list entered from pt history.
RTC for BP f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-021661",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-021661",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
