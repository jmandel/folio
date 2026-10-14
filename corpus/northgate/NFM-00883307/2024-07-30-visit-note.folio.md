---
folio: "0.1"
id: "01J436PJ70JQVAR6JMZ4FDW1KZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00883307"
effective: "2024-07-30T14:20:00-05:00"
recorded: "2024-07-30T20:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 142/82, repeat 137/81, pulse 70, wt 123 lb.
eGFR 40, K 4.6, A1c 6.6% today.
BP above goal, chlorthalidone started 12.5 mg daily today.
Will recheck labs at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-073025",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-073025",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
