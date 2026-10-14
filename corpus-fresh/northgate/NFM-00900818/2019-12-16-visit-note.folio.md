---
folio: "0.1"
id: "01DW8T4CJ0SAN1T1DW366FYKJ5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900818"
effective: "2019-12-16T14:00:00-06:00"
recorded: "2019-12-16T20:14:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records and history reviewed with pt.
BP 136/78, pulse 63, wt 185 lb.
Labs today: eGFR 41, K 4.6, UACR 10 mg/g, A1c 7.4%, LDL 118 mg/dL.
Metformin dose changed to 500 mg twice daily today (eGFR 41).
Pt voiced understanding. RTC for recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-121612",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-121612",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-121612",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
