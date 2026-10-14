---
folio: "0.1"
id: "01HBVNV59039EHYA2YVXH0VRK5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00988119"
effective: "2023-10-03T14:30:00-05:00"
recorded: "2023-10-03T16:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no new complaints.
BP 141/89, repeat 139/88. Pulse 83, wt 198 lb.
Today: eGFR 88, K 4.1, UACR 159 mg/g, A1c 6.1%.
Chlorthalidone started 12.5 mg daily today (BP above goal).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-100392",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-100392",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
