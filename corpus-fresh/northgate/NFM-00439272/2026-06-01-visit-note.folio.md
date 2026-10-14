---
folio: "0.1"
id: "01KT22HZZ0AM9WT77G5YERP6X7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00439272"
effective: "2026-06-01T09:00:00-05:00"
recorded: "2026-06-01T12:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 146/92, repeat 141/88, pulse 86, wt 185 lb.

Labs 5/28: eGFR 83, K 3.8, A1c 7.7%.

BP above goal. Chlorthalidone started 12.5 mg daily today.

RTC 1 mo for BP and BMP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-060114",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-060114",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-060114",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-060114",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
