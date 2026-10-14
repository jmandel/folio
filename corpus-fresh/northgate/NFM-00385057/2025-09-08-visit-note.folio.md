---
folio: "0.1"
id: "01K4NJEK905N2JWJ0491SPWGTJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00385057"
effective: "2025-09-08T13:30:00-05:00"
recorded: "2025-09-08T16:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 153/97, pulse 74, wt 149 lb.

Labs today: eGFR 72, K 4.5, A1c 8.3%.

A1c up, so dapagliflozin 10 mg daily started today. BP above goal, chlorthalidone 12.5 mg daily started today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-090875",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-090875",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-090875",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
