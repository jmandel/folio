---
folio: "0.1"
id: "01DSGCZHS07A99V76Q87N5SYEJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00192202"
effective: "2019-11-12T09:10:00-06:00"
recorded: "2019-11-12T12:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 142/86, repeat 140/86. Pulse 64, wt 234 lb.
Labs 11/10: eGFR 81, K 4.4, A1c 7%, LDL 97 mg/dL.
Records requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-111295",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-111295",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
