---
folio: "0.1"
id: "01GRMD8C006G2KZM9BBNSEYNAX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00655539"
effective: "2023-02-06T13:15:00-06:00"
recorded: "2023-02-06T16:24:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels fine.
BP 142/89, repeat 138/85. Pulse 65, wt 236 lb.
Labs today: eGFR 99, K 4.3, A1c 7%.
Continue current plan, home BP log encouraged.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-020666",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-020666",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-020666",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
