---
folio: "0.1"
id: "01FVX47540FGBQRNY19ZZCK3EW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2022-02-14T12:45:00-06:00"
recorded: "2022-02-14T16:04:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u.
BP 156/89, repeat 152/87. Pulse 65, wt 172 lb.
Labs today: eGFR 53, K 4.3, A1c 7.5%.
BP still above goal. Chlorthalidone started 12.5 mg daily today.
RTC 3 mo, sooner if dizzy.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-021418",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-021418",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-021418",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-021418",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
