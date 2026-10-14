---
folio: "0.1"
id: "01EJS0ZS10R0E89WT4MEBQ1A56"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484397"
effective: "2020-09-21T09:50:00-05:00"
recorded: "2020-09-21T14:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 131/85, pulse 63, wt 158 lb.
Labs 9/17: eGFR 81, K 4.4, LDL 71 mg/dL.
Reviewed results with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-092178",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-092178",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
