---
folio: "0.1"
id: "01JH8Y2ZJ0RRMFKH3MTR20ZGV5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00561860"
effective: "2025-01-10T08:50:00-06:00"
recorded: "2025-01-10T14:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Doing well, no new complaints.
BP 132/80, pulse 88, wt 225 lb.
eGFR 82, K 4.4, UACR 8 mg/g, A1c 6.8% today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-011055",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-011055",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
