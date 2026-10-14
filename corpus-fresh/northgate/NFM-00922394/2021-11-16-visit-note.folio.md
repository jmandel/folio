---
folio: "0.1"
id: "01FMNJ97P0F9E1QSGX09KHC66R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2021-11-16T12:42:00-06:00"
recorded: "2021-11-16T17:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling of lips and tongue has resolved.

Lisinopril allergy: angioedema of lips and tongue, added to allergy list.
Lisinopril: stopped today (angioedema).
Amlodipine: started 10 mg daily today (replacing lisinopril, angioedema).

Pt told to avoid ACE inhibitors and to call or go to ED if swelling recurs. BP recheck in 2 wk.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-111665",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-111665",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
