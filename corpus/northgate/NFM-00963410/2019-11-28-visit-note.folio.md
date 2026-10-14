---
folio: "0.1"
id: "01DTT70Y101Q8SS0QFBHH3PMQV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00963410"
effective: "2019-11-28T13:30:00-06:00"
recorded: "2019-11-28T17:55:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 136/91, pulse 76, wt 175 lb.
eGFR 62 and K 4.3 on 11/25.
Problem list built from pt history today.
RTC for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-112873",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-112873",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
