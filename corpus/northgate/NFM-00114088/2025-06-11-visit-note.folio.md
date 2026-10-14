---
folio: "0.1"
id: "01JXGMD09030WMA2D2DERF7S3D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00114088"
effective: "2025-06-11T15:50:00-05:00"
recorded: "2025-06-11T18:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. No new symptoms, tolerating current regimen.
BP 127/74, pulse 85, wt 196 lb.
Labs today: eGFR 74, K 4.2, LDL 109 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061121",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-061121",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
