---
folio: "0.1"
id: "01GMYBAT800398MDNMVJB25QC9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2022-12-22T14:45:00-06:00"
recorded: "2022-12-22T20:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Lip and tongue swelling, has settled per pt.
Lisinopril allergy: angioedema of lips and tongue, added to allergy list.
Lisinopril stopped today (angioedema). Amlodipine started 5 mg daily today to replace it.
Pt told to avoid lisinopril and to go to ED if swelling returns.
RTC 2–3 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-122283",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-122283",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
