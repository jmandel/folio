---
folio: "0.1"
id: "01JFWTP6405HS0KE5PMTC38R5A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2024-12-24T09:15:00-06:00"
recorded: "2024-12-24T11:16:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 123/72, pulse 77, wt 190 lb.
12/22 labs: A1c 6.8%, eGFR 49, K 4, UACR 387 mg/g, LDL 146.
eGFR a bit lower than before. Will recheck at next visit.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-122483",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-122483",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-122483",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
