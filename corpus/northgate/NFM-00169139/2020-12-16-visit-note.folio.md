---
folio: "0.1"
id: "01ESPW1JM033TVEJ19F0D58EYH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2020-12-16T12:30:00-06:00"
recorded: "2020-12-16T16:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no chest pain or SOB.
BP 124/71, pulse 68, wt 209 lb.
Labs 12/13: eGFR 97, K 4.7, A1c 6.7%.
Reviewed results with pt, no concerns today.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-121615",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-121615",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-121615",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
