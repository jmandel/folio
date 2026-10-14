---
folio: "0.1"
id: "01KC4N5K70102A4D73ZTRV47S1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172148"
effective: "2025-12-10T09:00:00-06:00"
recorded: "2025-12-10T11:33:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no new complaints.
BP 137/78, pulse 78, wt 147 lb.
Labs 12/4: eGFR 81, K 4.5, UACR 74 mg/g, A1c 7.5%, LDL 124.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-121031",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-121031",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
