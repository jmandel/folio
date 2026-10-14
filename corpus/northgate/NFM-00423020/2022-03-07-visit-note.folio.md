---
folio: "0.1"
id: "01FXKKKQG064454TPYCEY6PTA5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00423020"
effective: "2022-03-07T13:50:00-06:00"
recorded: "2022-03-07T19:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.

BP 143/86, pulse 67, wt 197 lb. Chlorthalidone started 12.5 mg daily today (BP above goal).

Labs today: eGFR 46, K 4.6, UACR 68 mg/g, A1c 7.7%.

Recheck BP and labs at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-030763",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-030763",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-030763",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
