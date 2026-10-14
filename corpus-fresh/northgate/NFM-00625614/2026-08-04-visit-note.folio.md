---
folio: "0.1"
id: "01KZ7KGJ00PG35Y0YG9XXA4632"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625614"
effective: "2026-08-04T13:45:00-05:00"
recorded: "2026-08-04T19:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels OK, no new complaints.
BP 147/83, repeat 145/79, pulse 63, wt 172 lb.
Labs 7/29: eGFR 43, K 4.1, UACR 47 mg/g, A1c 8.2%.
Metformin dose changed to 500 mg twice daily today (eGFR 41). Insulin glargine started 10 units at bedtime today (A1c 8.2).
Nephrology referral placed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-080485",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-080485",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
