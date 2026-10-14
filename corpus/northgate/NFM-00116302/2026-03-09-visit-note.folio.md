---
folio: "0.1"
id: "01KKAQKQV0TERERTEYW5KH4ER1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2026-03-09T15:00:00-05:00"
recorded: "2026-03-09T21:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.
BP 102/60, pulse 74, wt 238 lb.
Labs today: eGFR 45, K 4.2, UACR 51 mg/g, A1c 7.3%, LDL 77 mg/dL.
Metformin dose changed to 500 mg twice daily today (eGFR 44). Pt informed.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-030971",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-030971",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-030971",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
