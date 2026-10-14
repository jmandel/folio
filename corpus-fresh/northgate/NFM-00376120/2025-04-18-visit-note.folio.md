---
folio: "0.1"
id: "01JS549E90MESBY3MNSAGDZABM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00376120"
effective: "2025-04-18T10:00:00-05:00"
recorded: "2025-04-18T13:59:00-05:00"
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
BP 137/78, pulse 76, wt 177 lb.
Losartan resumed today (creatinine back to baseline).
Furosemide stopped today (AKI with hyperkalemia).
RTC 2 wks.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041874",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-041874",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
