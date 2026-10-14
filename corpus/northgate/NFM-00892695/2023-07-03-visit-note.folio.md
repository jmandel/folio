---
folio: "0.1"
id: "01H4F6WTK06EY27RKC6R3TAJM6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00892695"
effective: "2023-07-03T14:15:00-05:00"
recorded: "2023-07-03T20:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for acute kidney injury. Feels back to baseline, eating and drinking normally.
BP 151/78, repeat 148/78, pulse 66, wt 157 lb.
Losartan resumed today, creatinine back to baseline.
Pt to recheck BP at home.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-070336",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-070336",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
