---
folio: "0.1"
id: "01DQDF5B40469SH07GVSN71D32"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701178"
effective: "2019-10-17T11:45:00-05:00"
recorded: "2019-10-17T13:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 148/90, pulse 81, wt 233 lb.
Labs today: eGFR 76, K 4.3, UACR 244 mg/g, A1c 7%, LDL 86 mg/dL.
Problem list built from pt's history. Records to be requested.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-101748",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-101748",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
