---
folio: "0.1"
id: "01JZK5VPP0V773AXJAJ072C6P8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00479771"
effective: "2025-07-07T08:10:00-05:00"
recorded: "2025-07-07T14:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well overall.

BP 134/83, pulse 84, wt 222 lb.
Labs today: eGFR 78, K 4.5, LDL 107 mg/dL.
Results reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-070715",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-070715",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
