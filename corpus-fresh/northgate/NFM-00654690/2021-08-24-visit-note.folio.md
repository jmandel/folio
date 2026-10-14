---
folio: "0.1"
id: "01FDWW6BW01QG205BSBE51J920"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2021-08-24T12:10:00-05:00"
recorded: "2021-08-24T15:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 152/82, repeat 150/80. Pulse 73, wt 244 lb.
Labs 8/22: eGFR 93, K 4.6, UACR 492 mg/g, A1c 7.5%, LDL 142 mg/dL.
BP above goal. Lisinopril dose changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-082462",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-082462",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-082462",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
