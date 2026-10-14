---
folio: "0.1"
id: "01JYF49MP0HA9CXFW8P1QX6AX1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00437548"
effective: "2025-06-23T08:15:00-05:00"
recorded: "2025-06-23T14:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-062369",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-062369",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
