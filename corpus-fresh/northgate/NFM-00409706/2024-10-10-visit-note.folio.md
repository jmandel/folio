---
folio: "0.1"
id: "01J9VT8A50QBM0DDGQRDA8R079"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00409706"
effective: "2024-10-10T08:10:00-05:00"
recorded: "2024-10-10T13:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no complaints.
BP 117/75, pulse 79, wt 186 lb.
eGFR 69, K 4.1 today.
Reviewed labs with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101024",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-101024",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
