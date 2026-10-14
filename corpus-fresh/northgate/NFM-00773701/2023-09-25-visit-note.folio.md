---
folio: "0.1"
id: "01HB7233B0P3RWTH5WEMMTHTK2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2023-09-25T13:45:00-05:00"
recorded: "2023-09-25T15:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 145/95, repeat 141/93. Pulse 65, wt 225 lb.

Labs 9/19: eGFR 64, K 4.5, A1c 7.6%.

BP above goal, amlodipine started 5 mg daily today.

RTC 2 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092536",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092536",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-092536",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-092536",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2023-092536",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
