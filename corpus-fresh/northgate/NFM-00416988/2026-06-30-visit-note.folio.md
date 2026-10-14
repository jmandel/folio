---
folio: "0.1"
id: "01KWCNCS20N8N10MPJ84V19T5N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2026-06-30T09:30:00-05:00"
recorded: "2026-06-30T11:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 153/95, repeat 145/91, pulse 83, wt 204 lb.
Labs 6/24: eGFR 88, K 4.4, UACR 14 mg/g, A1c 6.7%, LDL 125 mg/dL.
BP above goal, losartan resumed today.
Recheck BMP in 2 wk. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-063095",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-063095",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
