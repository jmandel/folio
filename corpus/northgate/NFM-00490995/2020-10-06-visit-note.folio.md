---
folio: "0.1"
id: "01EKZK9ET0PW31APZNTF57KQDZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00490995"
effective: "2020-10-06T11:20:00-05:00"
recorded: "2020-10-06T13:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. No new complaints.
BP 143/83, repeat 135/82, pulse 74, wt 202 lb.
Labs today: eGFR 72, K 4.5, UACR 51 mg/g, A1c 7%.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-100611",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-100611",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
