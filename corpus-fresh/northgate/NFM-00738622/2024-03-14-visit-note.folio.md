---
folio: "0.1"
id: "01HRZ692C0REN2CH1AYW7FY433"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2024-03-14T08:40:00-05:00"
recorded: "2024-03-14T14:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 134/81, pulse 80, wt 217 lb.
Labs 3/8: A1c 8.1%, eGFR 64, K 4.2.
A1c above goal. Insulin glargine changed to 14 units at bedtime today. Pt to log fasting sugars.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031483",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031483",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
