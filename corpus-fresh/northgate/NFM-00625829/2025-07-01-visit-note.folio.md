---
folio: "0.1"
id: "01JZ3YM8X0HA1KM072ZMSQ47YZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625829"
effective: "2025-07-01T14:30:00-05:00"
recorded: "2025-07-01T16:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well, no new complaints.

BP 129/76, pulse 72, wt 176 lb.

Labs 6/26: eGFR 58, K 4.7, UACR 14 mg/g, A1c 7.2%, LDL 81 mg/dL. CKD stage 3a on problem list.

Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-070132",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-070132",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-070132",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
