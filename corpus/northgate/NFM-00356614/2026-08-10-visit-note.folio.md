---
folio: "0.1"
id: "01KZPY40T08AFJB85W7BMXAFSY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2026-08-10T13:15:00-05:00"
recorded: "2026-08-10T17:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 141/87, repeat 136/83, pulse 66, wt 240 lb.
Labs 8/8: eGFR 47, K 4.5, UACR 502 mg/g, A1c 7.6%, LDL 111 mg/dL.
UACR up, discussed with pt. BP better on repeat.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-081067",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-081067",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-081067",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
