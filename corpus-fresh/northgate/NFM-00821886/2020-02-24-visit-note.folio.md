---
folio: "0.1"
id: "01E1W2BYT09DFY2H4AT3PNW9F8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2020-02-24T08:10:00-06:00"
recorded: "2020-02-24T11:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. No new symptoms.
BP 126/76, pulse 77, wt 183 lb.
eGFR 84, K 4.3, A1c 7.8%. UACR 42 mg/g, will recheck.
Diet and exercise reinforced. RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-022434",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-022434",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-022434",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
