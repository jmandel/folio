---
folio: "0.1"
id: "01KAA5Q410SK6YDDRBP3WQAE8D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272471"
effective: "2025-11-17T15:40:00-06:00"
recorded: "2025-11-17T18:27:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 120/67, pulse 71, wt 154 lb.
Labs 11/12: eGFR 45, K 4.4, UACR 472 mg/g, A1c 7.8%.
Metformin dose changed to 500 mg twice daily today (eGFR 44).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-111758",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-111758",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-111758",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
