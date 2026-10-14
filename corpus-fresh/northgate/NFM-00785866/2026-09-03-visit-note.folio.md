---
folio: "0.1"
id: "01M1N1NPQ0TE2TQ48AJZZKM3RQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2026-09-03T14:50:00-05:00"
recorded: "2026-09-03T20:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 130/77, pulse 84, wt 149 lb.

Labs 8/28: A1c 6.5%, eGFR 45, K 4.4, UACR 123 mg/g.

Pt doing well. Reviewed labs together. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-090392",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-090392",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-090392",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
