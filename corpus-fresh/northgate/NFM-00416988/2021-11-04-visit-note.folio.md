---
folio: "0.1"
id: "01FKPCMSN073K4FDDZP56KVJ7Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2021-11-04T10:40:00-05:00"
recorded: "2021-11-04T16:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no complaints.
BP 146/88, repeat 141/85, pulse 77, wt 204 lb.
Today: eGFR 96, K 4.5, A1c 6.3%, LDL 124 mg/dL.
BP above goal, lisinopril dose changed to 20 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-110418",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-110418",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
