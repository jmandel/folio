---
folio: "0.1"
id: "01J4J1Z9X0WQ55FJCPEJTGQ0EJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272471"
effective: "2024-08-05T11:15:00-05:00"
recorded: "2024-08-05T14:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.
BP 125/76, pulse 70, wt 149 lb.
Labs 8/1: eGFR 56, K 5, A1c 7.4%. CKD stage 3a on problem list.
Nephrology referral discussed with pt.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-080535",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-080535",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-080535",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
