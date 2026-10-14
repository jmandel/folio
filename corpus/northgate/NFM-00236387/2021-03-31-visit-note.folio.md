---
folio: "0.1"
id: "01F25M2Q903TJ26KA4GNCP0PPW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00236387"
effective: "2021-03-31T15:40:00-05:00"
recorded: "2021-03-31T21:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 151/91, repeat 144/89, pulse 81, wt 187 lb.
Labs 3/29: eGFR 79, K 4.8, A1c 7%, LDL 84 mg/dL.
BP above goal, so lisinopril dose changed to 40 mg daily today.
Pt to keep checking BP at home. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-033146",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-033146",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
