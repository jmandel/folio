---
folio: "0.1"
id: "01KSKBJJT0PBZT8VXG9FQK7GK5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673781"
effective: "2026-05-26T13:50:00-05:00"
recorded: "2026-05-26T18:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new complaints.
BP 125/72, pulse 63, wt 211 lb.
Labs today: eGFR 61, K 4.4, UACR 15 mg/g, A1c 7.5%, LDL 129 mg/dL.
BP at goal today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-052622",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-052622",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
