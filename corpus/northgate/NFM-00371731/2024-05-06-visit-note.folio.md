---
folio: "0.1"
id: "01HX83RK009YKH0RF1WVJH6Q5X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00371731"
effective: "2024-05-06T13:15:00-05:00"
recorded: "2024-05-06T18:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u.

BP 152/93, repeat 148/89, pulse 69, wt 191 lb.

Labs 4/30: eGFR 57, K 4, UACR 202 mg/g, A1c 7.3%, LDL 79.

BP above goal. Chlorthalidone started 12.5 mg daily today.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-050617",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-050617",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-050617",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
