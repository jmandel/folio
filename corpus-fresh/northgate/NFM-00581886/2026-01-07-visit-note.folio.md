---
folio: "0.1"
id: "01KED8ND10CZAJFH3ZV06TZ3FY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00581886"
effective: "2026-01-07T10:00:00-06:00"
recorded: "2026-01-07T16:19:00-06:00"
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

BP 143/78, repeat 136/75, pulse 74, wt 189 lb.

Lisinopril: resumed today (creatinine back to baseline).

Will recheck BP at next visit. RTC 1 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-010784",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-010784",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
