---
folio: "0.1"
id: "01KWA7D1S0ZMR6W73KQKQ3ZZ9C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00273200"
effective: "2026-06-29T08:40:00-05:00"
recorded: "2026-06-29T12:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 130/82, pulse 71, wt 104 lb.
Labs 6/26: eGFR 61, K 4.7, UACR 12 mg/g, A1c 8.1%.
A1c 8.1, insulin glargine started today, 10 units at bedtime.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-062975",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-062975",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-062975",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
