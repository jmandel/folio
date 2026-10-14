---
folio: "0.1"
id: "01FCEKG5D04D0XCHTP4NPMSWBT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00920167"
effective: "2021-08-06T11:40:00-05:00"
recorded: "2021-08-06T15:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 136/81, pulse 75, wt 134 lb.
Labs 8/1: eGFR 68, K 4.3, UACR 314 mg/g, A1c 7.1%.
BP better. A1c up a bit from last. Diet and exercise reviewed.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-080639",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-080639",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-080639",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
