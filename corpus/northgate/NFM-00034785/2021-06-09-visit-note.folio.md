---
folio: "0.1"
id: "01F7RQ00A0VENXAVEBR1PYZGY8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034785"
effective: "2021-06-09T08:20:00-05:00"
recorded: "2021-06-09T10:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 149/86, pulse 74, wt 211 lb.
eGFR 79, K 3.8 today.
BP still above goal. Lisinopril changed to 40 mg daily today.
Pt voiced understanding.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-060983",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-060983",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
