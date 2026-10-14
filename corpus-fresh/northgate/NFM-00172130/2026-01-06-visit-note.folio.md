---
folio: "0.1"
id: "01KEAE2V40N8M62V2J7S69W1CY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172130"
effective: "2026-01-06T11:30:00-06:00"
recorded: "2026-01-06T13:56:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for acute kidney injury. Feels back to baseline, eating and drinking normally.
BP 142/78, repeat 138/75, pulse 81, wt 223 lb.
Losartan: resumed today (creatinine back to baseline).
Chlorthalidone: stopped today (AKI with hyperkalemia).
Recheck labs in 1-2 wks. RTC 1 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-010653",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-010653",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
