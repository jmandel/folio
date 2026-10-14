---
folio: "0.1"
id: "01HZG70C60D71MP34K6Z16BHDQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00347581"
effective: "2024-06-03T14:00:00-05:00"
recorded: "2024-06-03T18:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.

BP 135/85, pulse 63, wt 215 lb.
Today: eGFR 61, K 4.6, A1c 7%.

Results reviewed, pt to keep up diet and walking. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-060372",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-060372",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
