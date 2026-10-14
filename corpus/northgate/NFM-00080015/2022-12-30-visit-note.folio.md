---
folio: "0.1"
id: "01GNK4D5D058F82EARMN5EDZ1S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00080015"
effective: "2022-12-30T15:30:00-06:00"
recorded: "2022-12-30T21:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No complaints.
BP 140/80, pulse 66, wt 185 lb.
Labs 12/25: eGFR 89, K 4.7, A1c 7.6%, LDL 56.
BP above goal, chlorthalidone started 12.5 mg daily today.
Recheck BMP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-123054",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-123054",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
