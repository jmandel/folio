---
folio: "0.1"
id: "01H9K5KQA05HWM5YA3NAZ85J0Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00396807"
effective: "2023-09-05T08:20:00-05:00"
recorded: "2023-09-05T12:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 133/74, pulse 88, wt 224 lb.
Labs 8/30: eGFR 64, K 4.2, UACR 195 mg/g, A1c 7.4%, LDL 105 mg/dL.
Results discussed with pt. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-090593",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-090593",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-090593",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
