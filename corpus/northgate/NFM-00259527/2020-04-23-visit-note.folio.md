---
folio: "0.1"
id: "01E6MR2QJ0DV1A81H4XK9ZFF8D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00259527"
effective: "2020-04-23T14:30:00-05:00"
recorded: "2020-04-23T19:06:00-05:00"
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

BP 142/76, repeat 136/72, pulse 67, wt 230 lb. Today eGFR 73, K 4.5, UACR 298 mg/g, A1c 6.4%.

BP above goal, lisinopril dose changed to 40 mg daily today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-042315",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-042315",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
