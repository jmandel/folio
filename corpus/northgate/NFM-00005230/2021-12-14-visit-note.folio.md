---
folio: "0.1"
id: "01FPX590800E6QC45Q2PGWH73Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00005230"
effective: "2021-12-14T08:30:00-06:00"
recorded: "2021-12-14T13:04:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 152/92, repeat 146/90. Pulse 75, wt 187 lb.
Labs today: eGFR 68, K 4.7, UACR 73 mg/g, A1c 6.8%, LDL 100 mg/dL.
BP above goal, amlodipine started 5 mg daily today.
Pt agrees with plan.
RTC to recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-121435",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-121435",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
