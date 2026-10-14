---
folio: "0.1"
id: "01FFN25RP0DVMJP2EMW1T0N3TJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00923727"
effective: "2021-09-15T08:15:00-05:00"
recorded: "2021-09-15T10:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 136/81, pulse 83, wt 214 lb.

Today: eGFR 77, K 4.1, A1c 7.4%, LDL 109 mg/dL, UACR 473 mg/g.

Pt doing OK, no new complaints. Reviewed results with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-091585",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-091585",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-091585",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
