---
folio: "0.1"
id: "01K05C4GP0QESR40SDJ0TSZ0NH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00326951"
effective: "2025-07-14T11:10:00-05:00"
recorded: "2025-07-14T16:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new concerns. BP 124/67, pulse 65, wt 192 lb.

Exam unremarkable. Routine health maintenance discussed.

RTC 4 mo for DM.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-071434",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-071434",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
