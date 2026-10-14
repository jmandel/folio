---
folio: "0.1"
id: "01JMZ8RP50A10E96RTZV0PVWXS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00465508"
effective: "2025-02-25T10:10:00-06:00"
recorded: "2025-02-25T13:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. No new complaints.

BP 135/78, pulse 72, wt 218 lb.
Labs today: eGFR 93, K 4.1, LDL 108 mg/dL.

Reviewed results with pt, diet and activity encouraged. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-022522",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-022522",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
