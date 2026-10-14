---
folio: "0.1"
id: "01JP18T6A00BZN071Y3710D2B7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00589924"
effective: "2025-03-10T15:40:00-05:00"
recorded: "2025-03-10T19:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 143/86, pulse 66, wt 201 lb.
Labs 3/4: eGFR 69, K 4.3, A1c 8.3%.
Empagliflozin started 10 mg daily today (A1c 8.3).
Chlorthalidone started 12.5 mg daily today (BP above goal).
RTC to recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-031043",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-031043",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-031043",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
