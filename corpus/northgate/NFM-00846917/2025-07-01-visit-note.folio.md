---
folio: "0.1"
id: "01JZ3PCKD014X5FFHZHGX81J93"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00846917"
effective: "2025-07-01T12:20:00-05:00"
recorded: "2025-07-01T14:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 139/76, pulse 88, wt 150 lb.
Labs 6/26: eGFR 72, K 4.3, A1c 7.9%, LDL 131 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-070144",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-070144",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
