---
folio: "0.1"
id: "01G3YQ7CZ0CH8DX41KBRJYBS6Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00556918"
effective: "2022-05-25T13:50:00-05:00"
recorded: "2022-05-25T18:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 135/73, pulse 76, wt 226 lb.
Labs today: eGFR 54, K 4.6, UACR 9 mg/g, A1c 8%, LDL 92 mg/dL.
Reviewed results with pt. Will recheck and follow up at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-052513",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-052513",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-052513",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
