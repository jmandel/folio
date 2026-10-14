---
folio: "0.1"
id: "01GNZNZGB0T7C3J6KEGK98Z3H9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2023-01-04T14:20:00-06:00"
recorded: "2023-01-04T18:41:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.
BP 146/81, repeat 143/77, pulse 63, wt 198 lb.
Today: eGFR 66, K 4.3, UACR 101 mg/g, A1c 7.7%.
BP a bit up today. Will watch.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-010452",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-010452",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-010452",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
