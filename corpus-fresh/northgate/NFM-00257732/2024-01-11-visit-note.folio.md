---
folio: "0.1"
id: "01HKXC98R0KN9YQ6NBHRCPVE09"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2024-01-11T10:50:00-06:00"
recorded: "2024-01-11T17:04:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well, eating regularly.
BP 136/84, pulse 71, wt 168 lb.
Continue current meds. Diet reviewed.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-011143",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-011143",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
