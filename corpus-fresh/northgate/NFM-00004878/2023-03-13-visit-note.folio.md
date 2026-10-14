---
folio: "0.1"
id: "01GVEPNA004KGYME0TJW8YH6MZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00004878"
effective: "2023-03-13T13:10:00-05:00"
recorded: "2023-03-13T19:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 155/94, pulse 78, wt 186 lb.
Labs 3/7: eGFR 77, K 4.2, UACR 77 mg/g, A1c 6.5%.
BP above goal, so chlorthalidone started 12.5 mg daily today.
Recheck BMP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-031385",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-031385",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-031385",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
