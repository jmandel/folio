---
folio: "0.1"
id: "01JW7JNTC0T5VZFVD6PP60E9NH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2025-05-26T15:30:00-05:00"
recorded: "2025-05-26T19:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No hypoglycemia, no new symptoms.
BP 126/81, pulse 77, wt 183 lb.
5/24 labs: A1c 7.2%, eGFR 46, K 4.4.
eGFR slowly trending down. Pt aware.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-052655",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-052655",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
