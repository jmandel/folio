---
folio: "0.1"
id: "01HCBJK2A06DMRNGATTMWGR6S8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00861057"
effective: "2023-10-09T14:45:00-05:00"
recorded: "2023-10-09T20:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels well, no complaints.
BP 134/80, pulse 73, wt 162 lb.
10/3 labs: eGFR 69, K 4.2, LDL 123 mg/dL.
BP much improved. Diet and exercise reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-100914",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-100914",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
