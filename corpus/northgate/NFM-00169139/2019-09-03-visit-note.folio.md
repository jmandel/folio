---
folio: "0.1"
id: "01DKW883V07HV8NH9BZ8CR5SCB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2019-09-03T08:10:00-05:00"
recorded: "2019-09-03T14:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt, problem list entered.
BP 129/78, pulse 72, wt 204 lb.
Labs today: eGFR 97, K 4.7, UACR 13 mg/g, A1c 6.6%.
Pt asked to bring all pill bottles next time.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-090356",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-090356",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-090356",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
