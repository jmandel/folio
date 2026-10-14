---
folio: "0.1"
id: "01JMDQ31X0DSCCPPGB62VDHWJ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00099884"
effective: "2025-02-18T13:20:00-06:00"
recorded: "2025-02-18T17:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.

BP 154/93, repeat 150/90, pulse 73, wt 208 lb.

eGFR 64, K 4.4, A1c 7.6% today.

BP above goal, amlodipine started 5 mg daily today. Recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-021865",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-021865",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
