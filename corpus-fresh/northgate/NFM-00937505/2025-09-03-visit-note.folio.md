---
folio: "0.1"
id: "01K493JA80GXXTTK6WBPX2NZE7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937505"
effective: "2025-09-03T14:45:00-05:00"
recorded: "2025-09-03T19:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no new symptoms.
BP 128/73, pulse 77, wt 185 lb.
Labs 8/29: eGFR 54, K 4, A1c 7.5%, LDL 90 mg/dL.
Reviewed results with pt. Wt down a little.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-090342",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-090342",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
