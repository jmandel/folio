---
folio: "0.1"
id: "01HKQN0CZ0CXSGFXCYGN3ABXN8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625829"
effective: "2024-01-09T08:45:00-06:00"
recorded: "2024-01-09T11:41:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.

BP 135/77, pulse 67, wt 180 lb.

Labs 1/6: eGFR 61, K 4.5, UACR 12 mg/g, A1c 7.4%, LDL 164 mg/dL.

Discussed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-010936",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-010936",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-010936",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
