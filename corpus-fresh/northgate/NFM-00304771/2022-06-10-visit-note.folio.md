---
folio: "0.1"
id: "01G57EK5D0GYM1KXBQ6M5K8GP2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00304771"
effective: "2022-06-10T11:12:00-05:00"
recorded: "2022-06-10T13:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, breathing fine.
Lisinopril allergy: angioedema of lips and tongue, added to allergy list.
Lisinopril: stopped today (angioedema).
Amlodipine: started 10 mg daily today (replacing lisinopril, angioedema).
Pt to avoid ACE inhibitors going forward. RTC 2-4 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-061044",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-061044",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
