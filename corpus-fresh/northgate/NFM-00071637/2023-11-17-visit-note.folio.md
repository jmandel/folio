---
folio: "0.1"
id: "01HFFE5ZF0201XC9YCH4SX47FR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00071637"
effective: "2023-11-17T10:30:00-06:00"
recorded: "2023-11-17T14:05:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new complaints.

BP 148/85, pulse 78, wt 199 lb.
eGFR 53, K 4.7, UACR 275 mg/g, A1c 7.2% today.

BP above goal. Lisinopril increased to 40 mg daily today. Referring to nephrology for CKD.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-111765",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-111765",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-111765",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
