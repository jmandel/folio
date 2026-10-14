---
folio: "0.1"
id: "01G93CYCC0R80WFK1HHTPS2YZ2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2022-07-28T15:00:00-05:00"
recorded: "2022-07-28T16:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No complaints.
BP 131/83, pulse 69, wt 223 lb.
Today: eGFR 64, K 4.8, UACR 12 mg/g, A1c 6.7%, LDL 41 mg/dL.
Labs reviewed with pt, glad to see the A1c.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-072837",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-072837",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-072837",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-072837",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2022-072837",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
