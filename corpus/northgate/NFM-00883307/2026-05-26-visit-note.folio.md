---
folio: "0.1"
id: "01KSJXYSG0N674XPPMMH43D43S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00883307"
effective: "2026-05-26T12:10:00-05:00"
recorded: "2026-05-26T15:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new complaints.
BP 130/82, pulse 78, wt 121 lb.
Labs today: eGFR 31, K 4.8, UACR 243 mg/g, A1c 6.1%, LDL 143 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-052694",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-052694",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-052694",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
