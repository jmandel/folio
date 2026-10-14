---
folio: "0.1"
id: "01H7V3ZFM0G4H5000QK7EJK8B2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00650029"
effective: "2023-08-14T13:50:00-05:00"
recorded: "2023-08-14T17:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u.
BP 140/86, repeat 138/82, pulse 64, wt 185 lb.
RTC 3 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-081459",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-081459",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
