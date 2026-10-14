---
folio: "0.1"
id: "01FM32CSY07RNV4XVS79TNF24X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2021-11-09T10:40:00-06:00"
recorded: "2021-11-09T13:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no new symptoms.
BP 120/71, pulse 73, wt 177 lb.
Labs today: eGFR 63, K 4.4, A1c 7.7%, LDL 116 mg/dL.
Reviewed results with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-110947",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-110947",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
