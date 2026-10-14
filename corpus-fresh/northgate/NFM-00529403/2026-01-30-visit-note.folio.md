---
folio: "0.1"
id: "01KG873KS0C505JJK2SC1YW05M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00529403"
effective: "2026-01-30T09:15:00-06:00"
recorded: "2026-01-30T13:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 142/82, repeat 139/81, pulse 71, wt 173 lb.
Labs 1/25: eGFR 32, K 4.7, UACR 224 mg/g, A1c 9%, LDL 131 mg/dL.
Went over results with pt. No new complaints today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-013052",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-013052",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
