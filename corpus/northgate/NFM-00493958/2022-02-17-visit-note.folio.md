---
folio: "0.1"
id: "01FW4QSYQ0CF1CSMFX2K11M2H5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493958"
effective: "2022-02-17T09:10:00-06:00"
recorded: "2022-02-17T15:01:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2 and hyperlipidemia per pt.
BP 143/86, repeat 135/82, pulse 67, wt 185 lb.
Labs today: eGFR 49, K 4.1, UACR 69 mg/g, A1c 9.5%, LDL 108.
A1c 9.5 and CKD, so dapagliflozin started 10 mg daily today.
Records requested from prior office. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-021799",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-021799",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
