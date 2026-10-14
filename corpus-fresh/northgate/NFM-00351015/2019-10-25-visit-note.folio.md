---
folio: "0.1"
id: "01DR252ZM0Z9PSZ9MQ08Z1T8J0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2019-10-25T11:30:00-05:00"
recorded: "2019-10-25T14:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt reports dry cough for a while.
Lisinopril stopped today (dry cough); entered as intolerance. Losartan started 50 mg daily today for the ACE inhibitor cough.
BP 137/83, pulse 73, wt 150 lb.
Labs 10/22: eGFR 92, K 4.5, A1c 7.4%.
RTC 3 mo, BMP then.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-102578",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-102578",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-102578",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
