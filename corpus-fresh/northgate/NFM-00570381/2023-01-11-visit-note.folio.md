---
folio: "0.1"
id: "01GPHCZDT0FR1AMV1YB5Z6J7GE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00570381"
effective: "2023-01-11T10:10:00-06:00"
recorded: "2023-01-11T15:50:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 127/75, pulse 64, wt 223 lb.
Labs 1/5: eGFR 88, UACR 472 mg/g, A1c 8.3%, LDL 152 mg/dL. K 6.1 on that draw but hemolyzed; repeat K 4.7.
Insulin glargine: started 10 units at bedtime today (A1c 8.3).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011175",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-011175",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
