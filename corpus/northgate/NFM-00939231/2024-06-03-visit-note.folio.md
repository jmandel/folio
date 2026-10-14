---
folio: "0.1"
id: "01HZFVGAV0KQC9BH6Q01KQ5825"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2024-06-03T10:50:00-05:00"
recorded: "2024-06-03T15:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no complaints.
BP 141/94, repeat 138/92. Pulse 72, wt 205 lb.
eGFR 38, K 4.3, UACR 449 mg/g, A1c 7.2% today.
BP still above goal. Chlorthalidone started 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-060318",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-060318",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-060318",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
