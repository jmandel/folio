---
folio: "0.1"
id: "01GCT5W0T0NE1EH8NGSACP4B4K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00413130"
effective: "2022-09-12T15:10:00-05:00"
recorded: "2022-09-12T20:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 145/82, repeat 142/78, pulse 86, wt 186 lb.
Labs 9/6: eGFR 87, K 4.3, A1c 7.6%.
BP above goal, started chlorthalidone 12.5 mg daily today.
RTC 1 mo for BP and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-091249",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-091249",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-091249",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-091249",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2022-091249",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
