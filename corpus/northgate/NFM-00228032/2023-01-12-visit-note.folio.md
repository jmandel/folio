---
folio: "0.1"
id: "01GPKWZ7W0NSXE110AN1EW0VBT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00228032"
effective: "2023-01-12T10:45:00-06:00"
recorded: "2023-01-12T15:08:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no new concerns.
BP 120/85, pulse 69, wt 201 lb.
1/8 labs: eGFR 66, A1c 7.6%, LDL 80 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011286",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-011286",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
