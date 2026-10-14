---
folio: "0.1"
id: "01DXYPXVZ0BQC90PX0E1G8KJS6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2020-01-06T14:50:00-06:00"
recorded: "2020-01-06T18:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 146/92, pulse 75, wt 160 lb.
Labs today: eGFR 44, K 5.2, A1c 8.3%, LDL 178.
Metformin dose changed to 500 mg twice daily today (eGFR 44).
Insulin glargine started, 10 units at bedtime today (A1c 8.3).
Hx reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-010675",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-010675",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
