---
folio: "0.1"
id: "01HXWFNSK04ZJ8QX1VDEKXCCR9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00070366"
effective: "2024-05-14T12:45:00-05:00"
recorded: "2024-05-14T16:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Feeling well, no new complaints.
BP 124/74, pulse 80, wt 189 lb.
eGFR 78 on 5/11, stable.
No changes today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-051462",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-051462",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
