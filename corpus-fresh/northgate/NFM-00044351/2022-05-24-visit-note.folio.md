---
folio: "0.1"
id: "01G3W64SM0MQAM0NNE8G4B69NC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2022-05-24T15:50:00-05:00"
recorded: "2022-05-24T18:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 130/72, pulse 83, wt 239 lb.

Labs today: eGFR 72, K 4.3, UACR 11 mg/g, A1c 7.7%.

BP at goal. Pt doing OK, no new complaints. Continue current plan. RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-052438",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-052438",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-052438",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
