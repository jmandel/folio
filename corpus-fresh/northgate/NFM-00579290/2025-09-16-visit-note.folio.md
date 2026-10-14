---
folio: "0.1"
id: "01K5A3QXP0J751A592P77MX6FH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00579290"
effective: "2025-09-16T12:15:00-05:00"
recorded: "2025-09-16T15:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for acute kidney injury. Feels back to baseline.
BP 156/78, repeat 154/77. Pulse 66, wt 135 lb.
Creatinine back to baseline, so lisinopril resumed today. Hydrochlorothiazide resumed today as well.
Recheck BP at next visit.
RTC 1 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091622",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091622",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
