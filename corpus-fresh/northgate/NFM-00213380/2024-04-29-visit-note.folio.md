---
folio: "0.1"
id: "01HWPBGCF0YMT0597X7W8C77W6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00213380"
effective: "2024-04-29T15:15:00-05:00"
recorded: "2024-04-29T20:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well overall.
BP 131/79, pulse 88, wt 155 lb.
Exam unremarkable. Routine health maintenance discussed.
Continue current meds.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-042974",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-042974",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
