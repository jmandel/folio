---
folio: "0.1"
id: "01GK2W0EB00PNMM5F2ER90F3MJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00396807"
effective: "2022-11-29T12:45:00-06:00"
recorded: "2022-11-29T17:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK, no new symptoms.
BP 132/81, pulse 64, wt 227 lb.
Labs 11/23: eGFR 64, K 4.3, A1c 7.3%.
A1c up from last check, discussed with pt. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-112994",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-112994",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
