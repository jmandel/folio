---
folio: "0.1"
id: "01HYYA06C00091P77ZVF85QC6Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2024-05-27T14:50:00-05:00"
recorded: "2024-05-27T19:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c up again.
BP 145/87, pulse 80, wt 162 lb.
eGFR 62, K 4.4, UACR 29 mg/g, A1c 8.1% today.
Dulaglutide started 0.5 mg weekly today (A1c 8.1). Pt shown how to use the pen.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052738",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-052738",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
