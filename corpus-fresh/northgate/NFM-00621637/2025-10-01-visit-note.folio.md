---
folio: "0.1"
id: "01K6GQDHQ0851N7KMMZGQZPVYZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00621637"
effective: "2025-10-01T13:10:00-05:00"
recorded: "2025-10-01T15:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.

BP 122/76, pulse 70, wt 192 lb.

Labs today: eGFR 46, K 5, UACR 143 mg/g, A1c 7%.

eGFR continues to drift down, will repeat labs next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-100196",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-100196",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-100196",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
