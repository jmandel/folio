---
folio: "0.1"
id: "01KWA8WN70ZCVDFM9W55CQMH4M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00529403"
effective: "2026-06-29T09:30:00-05:00"
recorded: "2026-06-29T13:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 139/85, pulse 87, wt 174 lb.
Today: eGFR 30, K 5.3, UACR 237 mg/g, A1c 8.8%.
Reviewed trends with pt, questions answered.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-062969",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-062969",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
