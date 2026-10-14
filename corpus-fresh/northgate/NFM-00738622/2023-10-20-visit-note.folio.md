---
folio: "0.1"
id: "01HD7NJRQ08C0PPNTDF7RM206Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2023-10-20T13:00:00-05:00"
recorded: "2023-10-20T18:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 121/71, pulse 82, wt 214 lb.
Labs 10/16: A1c 7.8%, eGFR 64, K 4.4, LDL 96 mg/dL.
A1c a bit up, reviewed diet. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-102017",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-102017",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-102017",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
