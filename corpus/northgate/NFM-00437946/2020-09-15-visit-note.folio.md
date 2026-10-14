---
folio: "0.1"
id: "01EJ9QBEA0B8N6NWWKBA71S9Z9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00437946"
effective: "2020-09-15T11:20:00-05:00"
recorded: "2020-09-15T15:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 155/95, repeat 149/92, pulse 82, wt 226 lb.
eGFR 60, K 4.3, UACR 65 mg/g, A1c 9%, LDL 72 today.
Dapagliflozin started 10 mg daily today (A1c 9, CKD).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-091528",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-091528",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-091528",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
