---
folio: "0.1"
id: "01HNBRBG80NH7GCFJNA1DKSDGY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900818"
effective: "2024-01-29T15:00:00-06:00"
recorded: "2024-01-29T17:20:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well.
BP 133/83, pulse 81, wt 181 lb.
Labs today: eGFR 35, K 4.8, UACR 17 mg/g, A1c 7.1%, LDL 90 mg/dL.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012991",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-012991",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-012991",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
