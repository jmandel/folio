---
folio: "0.1"
id: "01F65HZBQ08TTHF7MP4P47BG7B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00830635"
effective: "2021-05-20T09:30:00-05:00"
recorded: "2021-05-20T13:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. History reviewed with pt.
BP 150/79, pulse 71, wt 256 lb.
Labs 5/15: eGFR 72, K 4.4, LDL 107 mg/dL.
BP above goal today. Will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-052074",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-052074",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-052074",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
