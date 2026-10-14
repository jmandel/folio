---
folio: "0.1"
id: "01KMZWFV20HCVFZ1M9D3XFVHY8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2026-03-30T08:10:00-05:00"
recorded: "2026-03-30T12:26:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 139/82, pulse 64, wt 159 lb.
Labs today: eGFR 30, K 4.9, A1c 8.3%.
Metformin stopped today (eGFR 30). Pt understands why.
RTC 2-3 mo to recheck A1c.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-033058",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-033058",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-033058",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-033058",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
