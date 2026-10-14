---
folio: "0.1"
id: "01J1TJXKE0EMDQXG66C68XWJSZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976595"
effective: "2024-07-02T11:16:00-05:00"
recorded: "2024-07-02T15:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, breathing and swallowing fine.
Lisinopril allergy: angioedema of lips and tongue. Added to allergy list.
Lisinopril stopped today (angioedema).
Amlodipine started 5 mg daily today, replacing lisinopril.
Pt to return or go to ED if any swelling recurs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-070211",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-070211",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
