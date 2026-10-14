---
folio: "0.1"
id: "01K4X0HKW0CKAHCDAED13ZHD4F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00457036"
effective: "2025-09-11T08:30:00-05:00"
recorded: "2025-09-11T13:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new symptoms.

BP 133/80, pulse 81, wt 254 lb.
Labs today: eGFR 63, K 4.3, A1c 7.3%.

Reviewed with pt. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091155",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091155",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
