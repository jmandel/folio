---
folio: "0.1"
id: "01EE9AMJ30TYVW0TX3PJERDXED"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2020-07-27T12:15:00-05:00"
recorded: "2020-07-27T18:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.
BP 140/91, repeat 135/91, pulse 67, wt 178 lb.
Labs today: eGFR 67, K 4.5, UACR 66 mg/g, A1c 7.8%, LDL 166 mg/dL.
BP above goal, chlorthalidone started 12.5 mg daily today.
Pt to report any dizziness. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-072711",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-072711",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
