---
folio: "0.1"
id: "01HF8434E0QAC5VCDZD5AV2MRF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00017276"
effective: "2023-11-14T13:45:00-06:00"
recorded: "2023-11-14T17:54:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 146/86, repeat 141/86, pulse 66, wt 222 lb.
Labs today: eGFR 40, K 4.7, UACR 284 mg/g, A1c 7.3%, LDL 95 mg/dL.
BP above goal. Losartan dose changed to 100 mg daily today (BP above goal).
Recheck BP and K at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-111434",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-111434",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-111434",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-111434",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
