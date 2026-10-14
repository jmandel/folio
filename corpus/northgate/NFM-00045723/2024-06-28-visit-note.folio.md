---
folio: "0.1"
id: "01J1FQPRJ0M4PZ4WX4K01KQGS0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00045723"
effective: "2024-06-28T08:30:00-05:00"
recorded: "2024-06-28T10:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 126/74, pulse 79, wt 171 lb.

Labs today: eGFR 76, K 4.6, UACR 97 mg/g, A1c 7%, LDL 61 mg/dL.

Problem list entered from pt history. Reviewed results with pt.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062831",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-062831",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-062831",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
