---
folio: "0.1"
id: "01G0F5JWF0VKWERZAEHM89NVMS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00616779"
effective: "2022-04-12T08:40:00-05:00"
recorded: "2022-04-12T10:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Patient ran out of lisinopril about 3 weeks ago and has not been taking it.
BP 137/87, pulse 85, wt 230 lb.
Labs today: eGFR 51, K 4.6, A1c 6.5%, LDL 70.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-041271",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-041271",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-041271",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
