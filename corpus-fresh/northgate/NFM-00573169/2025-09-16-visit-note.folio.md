---
folio: "0.1"
id: "01K59H8FX01PNJ69DRXGQ7CMH3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00573169"
effective: "2025-09-16T08:30:00-05:00"
recorded: "2025-09-16T10:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 141/87, pulse 83, wt 195 lb.
eGFR 34, K 4.9, A1c 8.3%, LDL 91 today.
BP above goal: amlodipine started 5 mg daily today. Told pt to report any ankle swelling.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091678",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091678",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-091678",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
