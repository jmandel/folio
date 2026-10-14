---
folio: "0.1"
id: "01M0TMMP703NHBHAJ91E4KVBA7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673477"
effective: "2026-08-24T11:10:00-05:00"
recorded: "2026-08-24T14:41:00-05:00"
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

BP 133/81, pulse 84, wt 157 lb.
eGFR 68 and K 4.2 today.

Labs reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-082489",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-082489",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
