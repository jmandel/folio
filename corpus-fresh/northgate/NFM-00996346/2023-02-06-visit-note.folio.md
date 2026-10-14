---
folio: "0.1"
id: "01GRM90W20240T9MKE89RK701Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00996346"
effective: "2023-02-06T11:00:00-06:00"
recorded: "2023-02-06T15:10:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 127/75, pulse 74, wt 190 lb.

Today: A1c 8.6%, eGFR 62, K 4.3, UACR 426 mg/g.

A1c 8.6 so insulin glargine dose changed to 14 units at bedtime today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-020611",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-020611",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
