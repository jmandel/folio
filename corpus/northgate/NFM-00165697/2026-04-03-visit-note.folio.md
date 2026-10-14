---
folio: "0.1"
id: "01KNAMCFG08AWZ2XMXFW16Y5YX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2026-04-03T14:40:00-05:00"
recorded: "2026-04-03T16:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well.
BP 116/72, pulse 78, wt 216 lb.
Labs today: eGFR 41, K 4.2, A1c 6.9%, LDL 87 mg/dL.
A1c at goal. Kidney function reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-040341",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-040341",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-040341",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
