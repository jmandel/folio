---
folio: "0.1"
id: "01H8ZAGV90ASSWSBB3HSK1X24Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900818"
effective: "2023-08-28T15:00:00-05:00"
recorded: "2023-08-28T19:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated. Feels back to baseline.
BP 140/78, pulse 85, wt 181 lb.
Empagliflozin stopped today (euglycemic DKA).
Entered as an adverse reaction: empagliflozin, euglycemic diabetic ketoacidosis.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-082813",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-082813",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-082813",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
