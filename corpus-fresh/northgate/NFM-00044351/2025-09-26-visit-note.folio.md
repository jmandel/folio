---
folio: "0.1"
id: "01K63PEN20BNVZJZT3M67AM7BZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2025-09-26T10:30:00-05:00"
recorded: "2025-09-26T14:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for AKI. Feels back to baseline, eating and drinking normally.

BP 122/78, pulse 73, wt 242 lb.

Creatinine back to baseline. Losartan resumed today. Chlorthalidone resumed today too.

RTC 1 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092619",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092619",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
