---
folio: "0.1"
id: "01GHKSEKG01G4VMKGK2Q3D5YHY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00591713"
effective: "2022-11-11T08:00:00-06:00"
recorded: "2022-11-11T10:48:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, exam unremarkable.

BP 119/70, pulse 68, wt 170 lb.
Labs 11/8: eGFR 65, K 4.

Reviewed results with pt. RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111128",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-111128",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
