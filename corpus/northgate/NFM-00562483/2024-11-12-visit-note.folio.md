---
folio: "0.1"
id: "01JCHKBAQ060S1N20040VSZB27"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00562483"
effective: "2024-11-12T15:30:00-06:00"
recorded: "2024-11-12T19:49:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels well.
BP 138/83, pulse 76, wt 158 lb.
Labs 11/6: eGFR 70, K 4.4, LDL 134 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111235",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111235",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
