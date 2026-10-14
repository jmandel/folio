---
folio: "0.1"
id: "01EPWJ45904WEHECH6MMD4Z6BF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727449"
effective: "2020-11-11T10:50:00-06:00"
recorded: "2020-11-11T15:07:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.

BP 146/82, repeat 139/79. Pulse 69, wt 184 lb.

Labs today: eGFR 84, K 4.5, UACR 10 mg/g, A1c 6.5%, LDL 85 mg/dL.

Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-111172",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-111172",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-111172",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
