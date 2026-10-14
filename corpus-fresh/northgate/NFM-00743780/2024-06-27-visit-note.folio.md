---
folio: "0.1"
id: "01J1DVM540WSTA59D6E7EBS4M9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00743780"
effective: "2024-06-27T11:40:00-05:00"
recorded: "2024-06-27T17:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.

BP 134/78, pulse 78, wt 136 lb.
Labs today: eGFR 81, UACR 191 mg/g, A1c 7.3%, LDL 148. K 6.1 but sample hemolyzed; repeat K 4.3.

Results reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062734",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-062734",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
