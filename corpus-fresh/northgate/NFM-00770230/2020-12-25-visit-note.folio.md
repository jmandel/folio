---
folio: "0.1"
id: "01ETDMP7E0S17G7CXMFJW419X9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770230"
effective: "2020-12-25T08:20:00-06:00"
recorded: "2020-12-25T13:06:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt reports a dry cough that has been bothering them.
BP 113/59, pulse 72, wt 173 lb.
Labs 12/21: eGFR 66, K 4.4, A1c 7.1%.
lisinopril: stopped today (dry cough). losartan: started 50 mg daily today (ACE inhibitor cough). lisinopril intolerance: dry cough.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-122534",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-122534",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
