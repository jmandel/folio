---
folio: "0.1"
id: "01J9A2JDJ0N0FZZ1KRAGJPMDWK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2024-10-03T10:50:00-05:00"
recorded: "2024-10-03T15:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Pt feels well, no new concerns.
BP 140/85, pulse 77, wt 224 lb.
Labs 9/30: eGFR 72, LDL 60 mg/dL.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-100329",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-100329",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
