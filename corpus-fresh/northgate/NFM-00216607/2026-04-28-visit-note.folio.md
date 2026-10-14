---
folio: "0.1"
id: "01KQBGVM30GNFQZ45KM69SST1B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00216607"
effective: "2026-04-28T15:10:00-05:00"
recorded: "2026-04-28T21:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.

BP 126/69, pulse 65, wt 231 lb.
Labs today: eGFR 68, K 4.6, UACR 11 mg/g, A1c 8.1%.

A1c up, insulin glargine started today, 10 units at bedtime. Pt instructed on pen use.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042849",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-042849",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-042849",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
