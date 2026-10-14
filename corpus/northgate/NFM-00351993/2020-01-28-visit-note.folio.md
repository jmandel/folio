---
folio: "0.1"
id: "01DZQ54Y90M4V6F6GZNBJMFG2Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351993"
effective: "2020-01-28T14:30:00-06:00"
recorded: "2020-01-28T16:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new complaints.
BP 143/92, repeat 137/91, pulse 81, wt 149 lb.
Labs 1/23: eGFR 61, K 4.3, UACR 9 mg/g, A1c 7.4%.
Will recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-012828",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-012828",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
