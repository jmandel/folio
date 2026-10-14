---
folio: "0.1"
id: "01H2Y2RKA0RT5JY3XEC8M1HNFE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034785"
effective: "2023-06-14T12:30:00-05:00"
recorded: "2023-06-14T18:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u.

lisinopril: resumed today (creatinine back to baseline)

chlorthalidone: stopped today (AKI with hyperkalemia)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-061463",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-061463",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
