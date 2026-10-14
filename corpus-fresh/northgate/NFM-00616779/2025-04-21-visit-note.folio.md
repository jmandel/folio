---
folio: "0.1"
id: "01JSDDQPP0WNYBZTQVWD6ZBEJ6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00616779"
effective: "2025-04-21T14:10:00-05:00"
recorded: "2025-04-21T19:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no complaints.
BP 132/64, pulse 81, wt 233 lb.
Labs 4/15: eGFR 43, K 4.5, A1c 6.6%, LDL 88.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-042137",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-042137",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
