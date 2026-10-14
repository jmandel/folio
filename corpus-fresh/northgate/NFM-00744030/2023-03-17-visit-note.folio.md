---
folio: "0.1"
id: "01GVRG7FR0DJC93HD68YNRDDJZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00744030"
effective: "2023-03-17T12:40:00-05:00"
recorded: "2023-03-17T14:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 149/96, pulse 78, wt 214 lb.
Labs 3/13: eGFR 92, K 4.7, UACR 48 mg/g, A1c 7.2%, LDL 139.
BP above goal, losartan dose changed to 100 mg daily today.
Recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-031776",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-031776",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-031776",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
