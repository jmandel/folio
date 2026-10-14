---
folio: "0.1"
id: "01H8335ZR09HQC8GT2CKS7G6N6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2023-08-17T14:45:00-05:00"
recorded: "2023-08-17T20:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 129/82, pulse 64, wt 236 lb.

8/12 labs: eGFR 69, K 4.3, A1c 7.5%.

A1c improved from spring. Pt feeling well. Routine health maintenance reviewed. RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-081768",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-081768",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-081768",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
