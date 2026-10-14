---
folio: "0.1"
id: "01E6CWWD007BHQAVCWNWESB0HF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00597721"
effective: "2020-04-20T15:45:00-05:00"
recorded: "2020-04-20T17:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 136/85, pulse 78, wt 276 lb.
eGFR 97 today, K 4.1.
Reviewed history with pt. Records to follow.
RTC for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-042044",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-042044",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
