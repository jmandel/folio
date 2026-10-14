---
folio: "0.1"
id: "01KGGNMV1019AWD62GQCH8J2AW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2026-02-02T14:20:00-06:00"
recorded: "2026-02-02T20:35:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 150/94, repeat 144/90. Pulse 80, wt 196 lb.
Today: eGFR 46, K 4.3, A1c 7.5%.
BP above goal on both readings. Home BP log to be brought to next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-020292",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-020292",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-020292",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
