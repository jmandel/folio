---
folio: "0.1"
id: "01GYZVVKF0VJV33N2Y3AVHEH1T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00225232"
effective: "2023-04-26T13:20:00-05:00"
recorded: "2023-04-26T17:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing well, no new concerns.
BP 139/77, pulse 68, wt 183 lb.
Labs today: eGFR 87, K 4.6, UACR 190 mg/g, A1c 7.4%, LDL 114 mg/dL.
Reviewed results with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-042643",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-042643",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-042643",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
