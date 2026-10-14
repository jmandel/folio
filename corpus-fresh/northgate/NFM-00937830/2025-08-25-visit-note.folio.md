---
folio: "0.1"
id: "01K3HCTH40V8MNBEAWGZ29TVJD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937830"
effective: "2025-08-25T12:30:00-05:00"
recorded: "2025-08-25T14:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt tolerating current regimen, no low sugar episodes reported.

BP 132/80, pulse 83, wt 209 lb.

Reviewed fasting log and diet. No changes today.

RTC 4–5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-082567",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-082567",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-082567",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
