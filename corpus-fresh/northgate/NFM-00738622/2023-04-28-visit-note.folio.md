---
folio: "0.1"
id: "01GZ5AHT6017JF4R4NWCWWV93V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2023-04-28T14:15:00-05:00"
recorded: "2023-04-28T20:38:00-05:00"
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
BP 139/81, pulse 66, wt 217 lb.
A1c 7.5%, eGFR 65, K 4.7 today.
A1c improved. Continue current plan. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-042824",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-042824",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
