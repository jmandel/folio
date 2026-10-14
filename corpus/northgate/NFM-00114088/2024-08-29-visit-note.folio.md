---
folio: "0.1"
id: "01J6FQNW40DRJ4CZKE8PN6CV0T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00114088"
effective: "2024-08-29T08:20:00-05:00"
recorded: "2024-08-29T13:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new complaints.
BP 113/68, pulse 70, wt 193 lb.
Labs 8/27: eGFR 76, K 4.
Reviewed results with pt, reassured.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082938",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-082938",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
