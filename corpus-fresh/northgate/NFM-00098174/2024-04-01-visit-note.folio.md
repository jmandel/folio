---
folio: "0.1"
id: "01HTDCCW40RT8BJWV7MAQ4DJPN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00098174"
effective: "2024-04-01T08:00:00-05:00"
recorded: "2024-04-01T12:48:00-05:00"
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

BP 150/90, repeat 143/86, pulse 84, wt 190 lb.

eGFR 57 today, K 4.4, A1c 7.2%. Chronic kidney disease stage 3a added to problem list.

BP above goal, lisinopril dose changed to 40 mg daily today. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040161",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040161",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-040161",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
