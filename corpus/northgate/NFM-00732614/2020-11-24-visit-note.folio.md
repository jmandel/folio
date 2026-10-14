---
folio: "0.1"
id: "01EQYGM7D0Z0W10T231DRTVKV1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00732614"
effective: "2020-11-24T14:30:00-06:00"
recorded: "2020-11-24T19:35:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.

BP 139/89, pulse 65, wt 199 lb.
Labs today: eGFR 79, K 4.2, UACR 124 mg/g, A1c 6.2%, LDL 95 mg/dL.

Discussed results with pt. Questions answered.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-112441",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-112441",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
