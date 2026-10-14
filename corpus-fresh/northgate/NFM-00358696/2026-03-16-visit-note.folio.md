---
folio: "0.1"
id: "01KKWCFXB01E0PQ0KB36X6GJFW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00358696"
effective: "2026-03-16T14:30:00-05:00"
recorded: "2026-03-16T17:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 141/81, pulse 76, wt 213 lb.
eGFR 37, K 4.9 today. LDL 85 mg/dL.
BP above goal, chlorthalidone started 12.5 mg daily today.
Recheck BMP in 2 wk.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031667",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-031667",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-031667",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
