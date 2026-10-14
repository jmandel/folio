---
folio: "0.1"
id: "01EY4AVZC01B9DSVB5DWVEKCR5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2021-02-09T13:45:00-06:00"
recorded: "2021-02-09T15:24:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 153/87, pulse 87, wt 134 lb.
Labs 2/7: eGFR 89, K 4.6, LDL 109 mg/dL.
BP above goal. Chlorthalidone started 12.5 mg daily today.
Recheck BMP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-020959",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-020959",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
