---
folio: "0.1"
id: "01HMCZY1C0P7ZNSSM3T4AYFWP4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2024-01-17T13:10:00-06:00"
recorded: "2024-01-17T18:36:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
Patient ran out of losartan about 3 weeks ago and has not been taking it.
BP 138/81, pulse 85, wt 218 lb.
Labs today: A1c 8%, eGFR 57, K 4.5, UACR 64 mg/g, LDL 114 mg/dL.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-011711",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-011711",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-011711",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
