---
folio: "0.1"
id: "01FXN7VFK0KSSDTMDCPW4DMM2T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922389"
effective: "2022-03-08T09:00:00-06:00"
recorded: "2022-03-08T11:05:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Ongoing dry cough on lisinopril.

BP 142/82, repeat 135/80, pulse 71, wt 187 lb. Labs today: eGFR 53, K 4.5, A1c 7.3%. CKD stage 3a on problem list.

Lisinopril: stopped today (dry cough). Losartan: started 50 mg daily today (ACE inhibitor cough). Lisinopril intolerance: dry cough, added to allergy list.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-030849",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-030849",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-030849",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-030849",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2022-030849",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
