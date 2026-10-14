---
folio: "0.1"
id: "01FPDXF8H0V837PW7WH1H6B5JY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00819371"
effective: "2021-12-08T10:00:00-06:00"
recorded: "2021-12-08T14:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Feels well.

BP 144/84, repeat 142/81, pulse 78, wt 189 lb.

eGFR 94, K 4.1 today.

BP above goal, lisinopril changed to 40 mg daily today. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-120878",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-120878",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
