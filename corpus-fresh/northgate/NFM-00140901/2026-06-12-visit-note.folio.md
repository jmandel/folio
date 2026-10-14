---
folio: "0.1"
id: "01KTY8D820A81T7E66PPH0AV6A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140901"
effective: "2026-06-12T08:45:00-05:00"
recorded: "2026-06-12T10:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 117/68, pulse 68, wt 241 lb.

Labs 6/8: eGFR 60, K 4.3, A1c 7.8%.

Reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-061256",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-061256",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
