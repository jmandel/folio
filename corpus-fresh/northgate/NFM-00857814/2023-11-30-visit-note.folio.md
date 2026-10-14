---
folio: "0.1"
id: "01HGGW16T08QNE34RMENHMR74C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00857814"
effective: "2023-11-30T11:00:00-06:00"
recorded: "2023-11-30T13:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, breathing normal.
Lisinopril allergy: angioedema of lips and tongue, entered on allergy list.
Lisinopril stopped today (angioedema).
Amlodipine started 5 mg daily today, replacing lisinopril.
Pt to call or return for any recurrent swelling.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-113042",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-113042",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
