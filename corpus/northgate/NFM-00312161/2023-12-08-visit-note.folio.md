---
folio: "0.1"
id: "01HH5JDG20WFXEB3Y7J4KEXB8X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2023-12-08T10:02:00-06:00"
recorded: "2023-12-08T14:38:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED follow-up: angioedema.

lisinopril allergy: angioedema of lips and tongue

lisinopril: stopped today (angioedema)

amlodipine: started 5 mg daily today (replacing lisinopril (angioedema))

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-120871",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-120871",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
