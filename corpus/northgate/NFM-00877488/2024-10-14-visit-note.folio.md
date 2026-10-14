---
folio: "0.1"
id: "01JA6W7730XGK6BFMJCKZTP8XC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877488"
effective: "2024-10-14T14:10:00-05:00"
recorded: "2024-10-14T20:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Doing well, no new complaints.

BP 115/65, pulse 63, wt 187 lb. eGFR 100, K 5 today.

Labs reviewed with pt. No changes today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101439",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-101439",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-101439",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
