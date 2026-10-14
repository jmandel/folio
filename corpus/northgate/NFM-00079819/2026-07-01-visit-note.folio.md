---
folio: "0.1"
id: "01KWFPE820TBAFK2FKX1NAC4ZD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00079819"
effective: "2026-07-01T13:10:00-05:00"
recorded: "2026-07-01T15:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well.
BP 145/85, repeat 140/84, pulse 74, wt 167 lb.
Labs today: eGFR 90, K 4.5, A1c 6.3%.
BP above goal. Chlorthalidone started 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-070155",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-070155",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
