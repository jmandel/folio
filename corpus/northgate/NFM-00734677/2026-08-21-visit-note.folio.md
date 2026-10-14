---
folio: "0.1"
id: "01M0JXM100RT5DMA1AXD7WTEYS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00734677"
effective: "2026-08-21T12:45:00-05:00"
recorded: "2026-08-21T14:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

metformin: dose changed to 500 mg twice daily today (eGFR 42)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-082172",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-082172",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-082172",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-082172",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
