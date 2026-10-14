---
folio: "0.1"
id: "01EEDJTF702Q1FW2X0QZ572812"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034785"
effective: "2020-07-29T08:50:00-05:00"
recorded: "2020-07-29T10:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 148/89, repeat 145/88. Pulse 75, wt 209 lb.
eGFR 81, K 4.7 today.
BP above goal, so lisinopril changed to 20 mg daily today.
Pt agrees with plan.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-072996",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-072996",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
