---
folio: "0.1"
id: "01GHY463C08HYT6WXGQ9X8BK2J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00099884"
effective: "2022-11-15T09:20:00-06:00"
recorded: "2022-11-15T11:08:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No complaints.

BP 153/92, repeat 151/88, pulse 73, wt 209 lb.

eGFR 62, K 4.3, A1c 6.7% today. A1c above goal, so dapagliflozin started 10 mg daily today. BP above goal, lisinopril dose changed to 20 mg daily today.

Recheck BP and labs at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111581",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-111581",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-111581",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
