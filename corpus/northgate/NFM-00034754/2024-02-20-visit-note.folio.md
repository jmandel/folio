---
folio: "0.1"
id: "01HQ4HNSR0FZ8T38XKC2H1HX75"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034754"
effective: "2024-02-20T15:30:00-06:00"
recorded: "2024-02-20T18:40:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 135/84, pulse 88, wt 208 lb.

Labs 2/16: eGFR 65, K 4.4, UACR 10 mg/g, A1c 7%, LDL 135 mg/dL.

Problem list entered from pt history. Questions answered, pt agrees with plan.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-022039",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-022039",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-022039",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
