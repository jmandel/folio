---
folio: "0.1"
id: "01JCHN5XQ08S1VYTTDP8CJ6AZN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00567532"
effective: "2024-11-12T14:45:00-06:00"
recorded: "2024-11-12T20:21:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care.
BP 144/90, repeat 142/89. Pulse 86, wt 203 lb.
Labs from 11/7: eGFR 45, K 4.7, LDL 104 mg/dL.
Reviewed history and problem list with pt. Kidney function reviewed, nephrology referral placed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111236",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111236",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-111236",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
