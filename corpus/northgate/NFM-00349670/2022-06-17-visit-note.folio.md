---
folio: "0.1"
id: "01G5SRZT50X79AY5PZD9K9SDSK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00349670"
effective: "2022-06-17T14:45:00-05:00"
recorded: "2022-06-17T16:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2, hyperlipidemia and obesity per pt, all added to the problem list.
BP 125/75, pulse 80, wt 175 lb.
Labs today: eGFR 55, K 4.5, UACR 380 mg/g, A1c 7.3%, LDL 72 mg/dL.
Albuminuria with reduced eGFR, referred to nephrology.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-061785",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-061785",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-061785",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
