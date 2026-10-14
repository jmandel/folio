---
folio: "0.1"
id: "01HQXSVKW0N9DEA2AMQFHH9G4P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2024-03-01T08:10:00-06:00"
recorded: "2024-03-01T14:04:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No complaints.
BP 156/95, repeat 152/94, pulse 62, wt 203 lb.
Today: eGFR 93, K 4.3, UACR 16 mg/g, A1c 6.4%.
BP above goal. Losartan started 50 mg daily today.
Recheck BMP and BP in 2-3 wk. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-030114",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-030114",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-030114",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
