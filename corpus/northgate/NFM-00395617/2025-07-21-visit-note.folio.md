---
folio: "0.1"
id: "01K0Q383B0VDF5Q4GVTEYN1DFP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2025-07-21T09:45:00-05:00"
recorded: "2025-07-21T13:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no new symptoms.
BP 137/89, pulse 87, wt 212 lb.
Today eGFR 69, K 4.9, UACR 82 mg/g, A1c 7.1%.
A1c improved. Albuminuria noted, will keep following.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-072123",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-072123",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
