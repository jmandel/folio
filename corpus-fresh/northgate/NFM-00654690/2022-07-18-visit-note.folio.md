---
folio: "0.1"
id: "01G89T9FK0C4MA9VRTY1F9QPSN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2022-07-18T12:10:00-05:00"
recorded: "2022-07-18T18:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, breathing fine.
Lisinopril allergy entered: angioedema of lips and tongue.
Lisinopril stopped today (angioedema).
Amlodipine started 10 mg daily today, replacing lisinopril.
Pt to call or go to ED if swelling returns.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071856",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071856",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
