---
folio: "0.1"
id: "01D6GT8SV0WKC7MX1EVSRXC6N2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2019-03-21T10:45:00-05:00"
recorded: "2019-03-21T14:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 130/79, pulse 83, wt 225 lb.
Labs today: eGFR 76, K 4.1, LDL 86 mg/dL.
Problem list built from pt's history.
RTC to review as scheduled.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-032149",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-032149",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
