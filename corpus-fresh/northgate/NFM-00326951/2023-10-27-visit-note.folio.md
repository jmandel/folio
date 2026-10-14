---
folio: "0.1"
id: "01HDSVJDR07MZRPTBBCMZET3X3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00326951"
effective: "2023-10-27T13:20:00-05:00"
recorded: "2023-10-27T19:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 133/81, pulse 83, wt 194 lb.

Metformin dose changed to 1000 mg twice daily today (A1c 8.2).
Empagliflozin started 10 mg daily today (A1c above goal).

Reviewed plan with pt, questions answered. RTC for DM f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-102775",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-102775",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
