---
folio: "0.1"
id: "01FW7B9F00T5WSKMM8HH82CNY6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00276077"
effective: "2022-02-18T13:30:00-06:00"
recorded: "2022-02-18T15:20:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 141/79, repeat 133/78. Pulse 63, wt 186 lb.
Labs today: eGFR 61, K 4.2, UACR 61 mg/g, A1c 6.5%, LDL 141 mg/dL.
Problem list built from pt history.
RTC after labs reviewed.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-021842",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-021842",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-021842",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-021842",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
