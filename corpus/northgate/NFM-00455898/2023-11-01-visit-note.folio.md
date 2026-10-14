---
folio: "0.1"
id: "01HE5ZXSH0QXK9V2DZNTQ3RFZW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00455898"
effective: "2023-11-01T08:10:00-05:00"
recorded: "2023-11-01T12:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Patient ran out of lisinopril about 3 weeks ago and has not been taking it.
BP 137/82, pulse 69, wt 231 lb.
Labs 10/29: eGFR 50, K 4.3, UACR 12 mg/g, A1c 7.8%.
CKD stage 3a on problem list.
Will recheck as needed, RTC per plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-110175",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-110175",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-110175",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-110175",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
