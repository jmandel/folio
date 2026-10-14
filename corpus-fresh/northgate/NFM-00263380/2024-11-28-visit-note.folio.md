---
folio: "0.1"
id: "01JDTM71Q0GKH2FK573BHCTNKG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00263380"
effective: "2024-11-28T14:15:00-06:00"
recorded: "2024-11-28T18:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records reviewed with pt.

BP 139/79, pulse 76, wt 167 lb.

Labs today: eGFR 67, K 4.3, A1c 7%, LDL 169 mg/dL.

Discussed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112887",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-112887",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-112887",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
