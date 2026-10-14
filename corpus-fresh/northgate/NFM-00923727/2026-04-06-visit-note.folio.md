---
folio: "0.1"
id: "01KNJ2ZZE0XCWC2S58GC1DAPMX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00923727"
effective: "2026-04-06T12:20:00-05:00"
recorded: "2026-04-06T14:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 133/83, pulse 77, wt 214 lb.

Labs 4/2: eGFR 73, K 4.7, A1c 8.2%.

Dulaglutide: started 0.5 mg weekly today (A1c 8.2). Went over injection technique with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-040624",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-040624",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-040624",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
