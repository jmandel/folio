---
folio: "0.1"
id: "01DM42ZSN044GJEN0NRKT2DQ93"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2019-09-06T09:00:00-05:00"
recorded: "2019-09-06T15:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. No new complaints.
BP 143/87, pulse 66, wt 222 lb.
eGFR 72, K 4.5, A1c 6.4% today.
BP above goal, lisinopril dose changed to 40 mg daily today.
RTC 3-4 mo, recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-090626",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-090626",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
