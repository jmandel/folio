---
folio: "0.1"
id: "01FS3DGZ90VJ6CWBQ4FJCGN4ZK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084740"
effective: "2022-01-10T13:30:00-06:00"
recorded: "2022-01-10T19:55:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 146/88, repeat 142/84. Pulse 72, wt 191 lb.
Labs 1/6: eGFR 64, K 4.9, A1c 7.4%.
BP above goal, started chlorthalidone 12.5 mg daily today. Recheck BMP in a couple of weeks.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-011065",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-011065",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-011065",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
