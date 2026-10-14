---
folio: "0.1"
id: "01J3RN55P0VS4BX0ZDG2KME4WN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484397"
effective: "2024-07-26T12:15:00-05:00"
recorded: "2024-07-26T18:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No new complaints.
BP 138/90, pulse 76, wt 157 lb.
Labs 7/20: eGFR 81, K 4.6.
Will recheck labs and BP at next contact.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-072696",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-072696",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
