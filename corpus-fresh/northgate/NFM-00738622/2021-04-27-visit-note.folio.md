---
folio: "0.1"
id: "01F4A3Z3F0HW396A6AFRY2GK1W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2021-04-27T09:10:00-05:00"
recorded: "2021-04-27T11:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels fine.
BP 137/91, pulse 75, wt 218 lb. BP high today, will recheck at next visit.
A1c 7.1%, eGFR 68, K 4.6, UACR 663 mg/g, LDL 155 mg/dL.
Diet and exercise reinforced. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-042728",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-042728",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-042728",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
