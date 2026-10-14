---
folio: "0.1"
id: "01EG1VQ630V26XQSCYMTKKR49R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701178"
effective: "2020-08-18T13:15:00-05:00"
recorded: "2020-08-18T17:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 156/96, pulse 62, wt 236 lb.
Today: eGFR 74, K 4.4, A1c 7.4%.
Losartan dose changed to 100 mg daily today (BP above goal).
Recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-081893",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-081893",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-081893",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
