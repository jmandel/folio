---
folio: "0.1"
id: "01ESVKEHP0PZSK5KK7EG168M95"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625829"
effective: "2020-12-18T08:20:00-06:00"
recorded: "2020-12-18T12:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN and DM2 reviewed with pt.

BP 143/87, repeat 141/86, pulse 70, wt 174 lb.

Labs 12/16: eGFR 64, K 4.7, UACR 8 mg/g, A1c 7.6%, LDL 165 mg/dL.

Will review labs and BP trend at next visit. Records requested from prior office.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-121858",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-121858",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
