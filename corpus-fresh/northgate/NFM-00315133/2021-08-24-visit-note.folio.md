---
folio: "0.1"
id: "01FDWX0060206X7PTN0DWYDACR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00315133"
effective: "2021-08-24T08:50:00-05:00"
recorded: "2021-08-24T15:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx per pt.
BP 136/85, pulse 64, wt 223 lb.
Labs today: eGFR 43, K 4.2, A1c 8%, LDL 143 mg/dL.
Metformin dose changed to 500 mg twice daily today (eGFR 43).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-082413",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-082413",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
