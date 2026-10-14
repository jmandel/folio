---
folio: "0.1"
id: "01GJ1EAPS06N683AMV49ZSVVJ8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00600773"
effective: "2022-11-16T14:30:00-06:00"
recorded: "2022-11-16T18:03:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.

BP 133/82, pulse 79, wt 144 lb.
11/10 labs: eGFR 63, K 4.7, UACR 15 mg/g, A1c 8.3%.

Empagliflozin started 10 mg daily today (A1c 8.3, CKD). Reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111658",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-111658",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-111658",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
