---
folio: "0.1"
id: "01JNFE38804EASE1S6N1QR764F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976595"
effective: "2025-03-03T14:15:00-06:00"
recorded: "2025-03-03T20:00:00-06:00"
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
BP 151/87, repeat 143/85, pulse 63, wt 140 lb.
2/26 labs: eGFR 71, K 4.3, LDL 123 mg/dL.
BP above goal. Losartan started 50 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-030376",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-030376",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
