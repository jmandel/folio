---
folio: "0.1"
id: "01K5YRZK20GZJR3HFPQRA34XWG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283514"
effective: "2025-09-24T11:10:00-05:00"
recorded: "2025-09-24T16:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u.

BP 148/97, repeat 144/96, pulse 85, wt 198 lb.
Labs today: eGFR 86, K 4.7.

BP above goal, so lisinopril dose changed to 40 mg daily today. Pt agrees with plan.
RTC 4 wk for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092426",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092426",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-092426",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
