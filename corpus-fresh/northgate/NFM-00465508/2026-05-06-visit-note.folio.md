---
folio: "0.1"
id: "01KQZNSE80PBQ13MH65KDBS9ES"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00465508"
effective: "2026-05-06T13:40:00-05:00"
recorded: "2026-05-06T17:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new concerns.

BP 123/75, pulse 70, wt 217 lb.
eGFR 95 today. LDL 86 mg/dL today.

Results reviewed with pt. RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-050685",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-050685",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
