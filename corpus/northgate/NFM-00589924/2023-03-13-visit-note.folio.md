---
folio: "0.1"
id: "01GVEX2CG0NAR8F9TFFGJ5V42E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00589924"
effective: "2023-03-13T15:50:00-05:00"
recorded: "2023-03-13T20:52:00-05:00"
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
BP 143/86, repeat 136/84. Pulse 80, wt 207 lb.
Labs today: eGFR 70, K 4.5, A1c 7.2%, LDL 116 mg/dL.
Problem list built from pt's history.
RTC to review labs and BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-031373",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-031373",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-031373",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-031373",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
