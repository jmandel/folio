---
folio: "0.1"
id: "01KPNX7NE0TP68R077ER01NE5Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00004878"
effective: "2026-04-20T09:10:00-05:00"
recorded: "2026-04-20T11:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Pt feels well.
BP 133/82, pulse 83, wt 186 lb.
4/14 labs: eGFR 74, K 4.4, UACR 85 mg/g, A1c 7.3%.
A1c drifting up, UACR unchanged. Reviewed diet and activity.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042011",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-042011",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
