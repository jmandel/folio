---
folio: "0.1"
id: "01FH8R4D10FB8YC8PGY332N065"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00570381"
effective: "2021-10-05T10:01:00-05:00"
recorded: "2021-10-05T12:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, breathing fine, no lip or tongue swelling on exam today.
Lisinopril allergy: angioedema of lips and tongue, added to allergy list.
Lisinopril: stopped today (angioedema).
Amlodipine: dose changed to 10 mg daily today (replacing lisinopril, angioedema).
Pt told to go to the ED if swelling returns. RTC 1 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-100512",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-100512",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
