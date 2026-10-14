---
folio: "0.1"
id: "01FVXJMJR0SCVKDVXV48VB1WQZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034785"
effective: "2022-02-14T13:50:00-06:00"
recorded: "2022-02-14T20:16:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 155/97, pulse 79, wt 210 lb.
eGFR 81, K 4.6 today.
BP above goal. Chlorthalidone started 12.5 mg daily today.
Reviewed with pt, no questions.
RTC 3 mo for BP and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-021428",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-021428",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-021428",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
