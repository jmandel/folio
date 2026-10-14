---
folio: "0.1"
id: "01JWY0QQB07DT10PY7RA4MTWTY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00912291"
effective: "2025-06-04T08:20:00-05:00"
recorded: "2025-06-04T12:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

metformin: dose changed to 1000 mg twice daily today (A1c 8.3)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-060465",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-060465",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-060465",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
