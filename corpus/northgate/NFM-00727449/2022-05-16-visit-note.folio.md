---
folio: "0.1"
id: "01G3733V508MHSCZB9J6BAXJTG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727449"
effective: "2022-05-16T12:15:00-05:00"
recorded: "2022-05-16T13:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.

BP 134/77, pulse 65, wt 187 lb.

Labs 5/10: eGFR 83, K 4.8, A1c 6.6%, LDL 104 mg/dL. Reviewed with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-051621",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-051621",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
