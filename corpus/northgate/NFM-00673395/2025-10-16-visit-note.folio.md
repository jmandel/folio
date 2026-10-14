---
folio: "0.1"
id: "01K7QKQND0E77CAC9KHEEMWV69"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673395"
effective: "2025-10-16T11:50:00-05:00"
recorded: "2025-10-16T17:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 125/76, pulse 84, wt 152 lb.
Labs 10/10: eGFR 42, K 4.2, UACR 17 mg/g, A1c 7.1%, LDL 134.
Pt doing well, no new complaints. Results reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-101673",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-101673",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-101673",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
