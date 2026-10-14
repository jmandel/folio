---
folio: "0.1"
id: "01G3W831T0JCMXXK5VCTJR2Q5H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976595"
effective: "2022-05-24T13:15:00-05:00"
recorded: "2022-05-24T18:58:00-05:00"
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
BP 148/89, pulse 84, wt 140 lb.
Labs from 5/19: eGFR 72, K 4.8, LDL 70 mg/dL.
BP elevated today, will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-052477",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-052477",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
