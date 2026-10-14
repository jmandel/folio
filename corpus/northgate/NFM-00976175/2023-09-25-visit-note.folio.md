---
folio: "0.1"
id: "01HB7JXDX0YGHGYN3TV4M4WWX2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976175"
effective: "2023-09-25T15:15:00-05:00"
recorded: "2023-09-25T20:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 140/87, pulse 84, wt 221 lb.
BP above goal today, amlodipine started 5 mg daily.
Pt to report any ankle swelling or dizziness.
Cont diet and activity changes.
RTC 6 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092552",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092552",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
