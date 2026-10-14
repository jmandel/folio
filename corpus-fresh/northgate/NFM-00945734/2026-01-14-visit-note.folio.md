---
folio: "0.1"
id: "01KEZ71H30WJGAC5QZW4TCDST2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00945734"
effective: "2026-01-14T12:10:00-06:00"
recorded: "2026-01-14T15:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well, no new symptoms.

BP 139/82, pulse 83, wt 217 lb.

Labs today: eGFR 69, K 4.2, UACR 90 mg/g, A1c 6.7%, LDL 98 mg/dL.

Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-011423",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-011423",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
