---
folio: "0.1"
id: "01J82ZX1Z0AE32BJXPG3DR9PEC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00304836"
effective: "2024-09-18T09:20:00-05:00"
recorded: "2024-09-18T11:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 118/72, pulse 70, wt 220 lb.
A1c 8.3. Insulin glargine started 10 units at bedtime today.
Pt taught pen use and low sugar symptoms.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091811",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-091811",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
