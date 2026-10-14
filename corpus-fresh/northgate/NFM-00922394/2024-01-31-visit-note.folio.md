---
folio: "0.1"
id: "01HNGXYJJ0JEKVEG8DST8AE8XT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2024-01-31T15:40:00-06:00"
recorded: "2024-01-31T17:34:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.

BP 133/82, pulse 66, wt 154 lb.
Today: eGFR 64, K 4.4, A1c 7.7%.

Discussed diet and home sugars. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-013133",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-013133",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
