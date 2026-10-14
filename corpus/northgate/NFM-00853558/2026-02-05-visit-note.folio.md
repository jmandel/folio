---
folio: "0.1"
id: "01KGQP9J30RW0FFFEAEX261NE5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00853558"
effective: "2026-02-05T08:30:00-06:00"
recorded: "2026-02-05T14:01:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u.
BP 126/74, pulse 85, wt 167 lb.
Labs 1/31: eGFR 90, K 4.4, A1c 8.2%.
Insulin glargine: dose changed to 14 units at bedtime today (A1c 8.2). Pt to watch for lows.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-020554",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-020554",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-020554",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-020554",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
