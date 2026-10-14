---
folio: "0.1"
id: "01F5Y83V20HH7ZT1NVBRKF44V6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2021-05-17T11:20:00-05:00"
recorded: "2021-05-17T17:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 146/87, repeat 142/86. Pulse 74, wt 178 lb.
Labs today: eGFR 52, K 4.7, A1c 8.3%, LDL 153.
Dapagliflozin started 10 mg daily today (A1c 8.3, CKD).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-051789",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-051789",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-051789",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
