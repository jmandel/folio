---
folio: "0.1"
id: "01JFJV5JM0EY5NX2F7FQC79XZR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2024-12-20T08:00:00-06:00"
recorded: "2024-12-20T14:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for acute kidney injury. Feels back to baseline, eating and drinking normally.
BP 135/78, pulse 82, wt 206 lb.
Losartan resumed today (creatinine back to baseline). Furosemide resumed today (creatinine back to baseline).
Hydrochlorothiazide stopped today (AKI with hyperkalemia).
RTC 2 wk.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-122073",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-122073",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
