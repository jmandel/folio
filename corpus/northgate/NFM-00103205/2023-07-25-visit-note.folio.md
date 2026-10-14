---
folio: "0.1"
id: "01H67GPX60ZQ8KPFSPKH3YE20B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2023-07-25T10:30:00-05:00"
recorded: "2023-07-25T16:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, wt stable.
BP 128/76, pulse 85, wt 200 lb.
Labs today: eGFR 67, K 3.9, UACR 462 mg/g, A1c 6.3%.
A1c down nicely. UACR up again, discussed with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-072574",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-072574",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-072574",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
