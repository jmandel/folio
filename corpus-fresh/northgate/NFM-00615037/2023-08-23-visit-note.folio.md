---
folio: "0.1"
id: "01H8JNZ9F0GCAWTQPCN9B9TC4K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00615037"
effective: "2023-08-23T15:20:00-05:00"
recorded: "2023-08-23T21:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.
BP 150/90, repeat 142/90, pulse 85, wt 174 lb.
Labs today: eGFR 49, K 4.6, UACR 61 mg/g. Chronic kidney disease stage 3a.
BP above goal. Lisinopril dose changed to 40 mg daily today.
Discussed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-082348",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-082348",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-082348",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-082348",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
