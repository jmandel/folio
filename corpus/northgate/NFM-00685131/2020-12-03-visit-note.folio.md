---
folio: "0.1"
id: "01ERNDVBQ0QEA1WW4W76ANYFMS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00685131"
effective: "2020-12-03T14:20:00-06:00"
recorded: "2020-12-03T17:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new complaints.

BP 140/87, repeat 135/83, pulse 68, wt 226 lb.
Labs 11/28: eGFR 60, K 4.5, UACR 139 mg/g.

Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-120374",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-120374",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
