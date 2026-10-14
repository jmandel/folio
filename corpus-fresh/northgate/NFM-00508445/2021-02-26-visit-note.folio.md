---
folio: "0.1"
id: "01EZFYDJB0A6WDWVTAWJM3W5XB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00508445"
effective: "2021-02-26T09:30:00-06:00"
recorded: "2021-02-26T13:53:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well.
BP 122/74, pulse 65, wt 247 lb, down a few lb.
Labs 2/22: eGFR 59, K 4.5, UACR 177 mg/g.
Encouraged to keep up the wt loss.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-022689",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-022689",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
