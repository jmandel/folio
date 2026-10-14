---
folio: "0.1"
id: "01HBVPT9C0H80A3Y5JMY7CNM14"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00682106"
effective: "2023-10-03T13:15:00-05:00"
recorded: "2023-10-03T16:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no new symptoms.

BP 120/72, pulse 79, wt 244 lb.
Today: eGFR 69, K 4.4, UACR 61 mg/g, A1c 6.6%.

Discussed A1c trend and weight with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-100345",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-100345",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
