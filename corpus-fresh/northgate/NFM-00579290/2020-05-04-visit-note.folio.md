---
folio: "0.1"
id: "01E7GKZCB0390CQDMW2PBFTEJ1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00579290"
effective: "2020-05-04T10:00:00-05:00"
recorded: "2020-05-04T14:53:00-05:00"
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
BP 145/88, repeat 142/87. Pulse 62, wt 132 lb.
Labs today: eGFR 72, K 3.8, A1c 7.9%, LDL 120 mg/dL.
Problem list built from pt's history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-050493",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-050493",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
