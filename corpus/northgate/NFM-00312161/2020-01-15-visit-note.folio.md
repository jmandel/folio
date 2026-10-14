---
folio: "0.1"
id: "01DYNXPSE02JS8GT1HTY2Z0490"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2020-01-15T12:45:00-06:00"
recorded: "2020-01-15T18:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.

BP 135/78, pulse 76, wt 215 lb.
Labs 1/9: eGFR 51, K 4.1, A1c 7.9%.
CKD stage 3a on problem list. Discussed what that means, pt voiced understanding.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-011557",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-011557",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-011557",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
