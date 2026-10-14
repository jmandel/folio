---
folio: "0.1"
id: "01K8P53X80VKN0TEYDZXWM8CA0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00530802"
effective: "2025-10-28T08:30:00-05:00"
recorded: "2025-10-28T14:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 135/85, pulse 68, wt 208 lb.
Labs 10/25: eGFR 98, K 4.5, A1c 7.4%.
A1c improved. Pt doing well.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-102818",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-102818",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
