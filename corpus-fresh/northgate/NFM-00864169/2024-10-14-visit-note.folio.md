---
folio: "0.1"
id: "01JA5WJMR0QY8PQNG1J0AXSVFJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00864169"
effective: "2024-10-14T09:20:00-05:00"
recorded: "2024-10-14T11:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Feels well today.
BP 122/79, pulse 86, wt 162 lb.
Labs today: eGFR 73, K 4.8, LDL 140 mg/dL.
Reviewed history with pt, records to be requested.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101451",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-101451",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-101451",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
