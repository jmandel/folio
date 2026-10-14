---
folio: "0.1"
id: "01H1MTP5G0424N693BEA1A31A5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00032392"
effective: "2023-05-29T14:50:00-05:00"
recorded: "2023-05-29T17:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No complaints.
BP 135/78, pulse 67, wt 197 lb.
5/25 labs: eGFR 85, K 4.4, A1c 7%, LDL 133 mg/dL.
Reviewed results with pt, diet and exercise encouraged.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-052914",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-052914",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-052914",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
