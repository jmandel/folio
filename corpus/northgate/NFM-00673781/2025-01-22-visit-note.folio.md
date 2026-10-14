---
folio: "0.1"
id: "01JJ8GTQJ0SG0QPAMNNJ7G3VWW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673781"
effective: "2025-01-22T15:45:00-06:00"
recorded: "2025-01-22T20:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels OK, no new symptoms.
BP 148/91, repeat 140/88. Pulse 75, wt 212 lb.
Labs today: eGFR 64, K 4.3, A1c 8.1%, LDL 163 mg/dL.
A1c 8.1: started insulin glargine 10 units at bedtime today. BP above goal: started chlorthalidone 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-012229",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-012229",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-012229",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
