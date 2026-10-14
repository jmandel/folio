---
folio: "0.1"
id: "01JERXRE704880GJRW6MF2R3QT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00382868"
effective: "2024-12-10T09:15:00-06:00"
recorded: "2024-12-10T12:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no complaints.
BP 118/80, pulse 76, wt 203 lb.
Labs today: eGFR 78, A1c 6.4%, LDL 92 mg/dL.
Reviewed results with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-121035",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-121035",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
