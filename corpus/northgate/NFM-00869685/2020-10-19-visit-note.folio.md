---
folio: "0.1"
id: "01EN0R56Y03N2CMVN2FC3YMJ8A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00869685"
effective: "2020-10-19T08:00:00-05:00"
recorded: "2020-10-19T10:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt, records to follow.
BP 148/87, pulse 62, wt 203 lb.
Labs from 10/13: eGFR 96, K 4.2.
BP above goal today, will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-101943",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-101943",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
