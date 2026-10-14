---
folio: "0.1"
id: "01JVT0HKK0R9KEDXTDDGNPWE08"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00176879"
effective: "2025-05-21T08:10:00-05:00"
recorded: "2025-05-21T13:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 133/84, pulse 81, wt 228 lb.
eGFR 82, K 4.3 today.
Lisinopril: stopped today (dry cough). Lisinopril intolerance: dry cough.
Losartan: started 50 mg daily today (ACE inhibitor cough).
Pt agrees with plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-052159",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-052159",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
