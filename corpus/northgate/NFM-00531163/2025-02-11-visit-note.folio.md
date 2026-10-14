---
folio: "0.1"
id: "01JKVE9NS0M9HDC0Z4DPSJHYBZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531163"
effective: "2025-02-11T10:50:00-06:00"
recorded: "2025-02-11T15:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-021126",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-021126",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
