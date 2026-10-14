---
folio: "0.1"
id: "01FCPK5A909W3XT00NM278KYT9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2021-08-09T14:40:00-05:00"
recorded: "2021-08-09T18:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 152/84, pulse 64, wt 158 lb.
Labs 8/5: eGFR 42, K 4.9, A1c 6.7%.
BP above goal again. Chlorthalidone started, 12.5 mg daily today.
Will recheck K and renal fn after the start. RTC 6 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-080947",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-080947",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-080947",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-080947",
    "rank": 3,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
