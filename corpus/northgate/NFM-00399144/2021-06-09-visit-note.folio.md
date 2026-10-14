---
folio: "0.1"
id: "01F7SECX507S58Z8AR1N0V7THZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00399144"
effective: "2021-06-09T11:50:00-05:00"
recorded: "2021-06-09T17:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new complaints.
BP 137/75, pulse 88, wt 202 lb.
Labs 6/6: eGFR 62, K 3.8, A1c 6.9%.
Reviewed results with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-060961",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-060961",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
