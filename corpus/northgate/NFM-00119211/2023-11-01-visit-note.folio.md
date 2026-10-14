---
folio: "0.1"
id: "01HE6A0210CFDJZPERMFTWQK1R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00119211"
effective: "2023-11-01T11:30:00-05:00"
recorded: "2023-11-01T15:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 117/70, pulse 83, wt 198 lb.
Labs 10/30: eGFR 59, K 3.7, A1c 7.4%.
Reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-110177",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
