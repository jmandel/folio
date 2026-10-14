---
folio: "0.1"
id: "01HDF8TJR08QYBZNR0NTMC6CKF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00004878"
effective: "2023-10-23T10:50:00-05:00"
recorded: "2023-10-23T17:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no new symptoms.
BP 140/75, repeat 137/74, pulse 82, wt 186 lb.
eGFR 77, K 4, A1c 6.4%, LDL 106 mg/dL today.
BP above goal, amlodipine started 5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-102375",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-102375",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-102375",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
