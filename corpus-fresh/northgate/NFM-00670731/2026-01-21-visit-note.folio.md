---
folio: "0.1"
id: "01KFHBYCV0478T4XMZEE5NGFAP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2026-01-21T11:20:00-06:00"
recorded: "2026-01-21T16:49:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt ran out of lisinopril about 3 weeks ago and has not been taking it.
BP 142/81, repeat 139/80. Pulse 80, wt 220 lb.
1/15 labs: eGFR 41, K 4.7, UACR 615 mg/g, A1c 6.9%, LDL 140 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-012154",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-012154",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-012154",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
