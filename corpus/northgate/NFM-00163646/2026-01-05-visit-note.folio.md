---
folio: "0.1"
id: "01KE7YABE027GZMMNB8A78AG42"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00163646"
effective: "2026-01-05T12:40:00-06:00"
recorded: "2026-01-05T14:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt feels well.

BP 130/81, pulse 67, wt 168 lb.
Labs 1/3: eGFR 92, K 4.3, UACR 70 mg/g, A1c 7.5%.

Discussed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-010518",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-010518",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
