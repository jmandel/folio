---
folio: "0.1"
id: "01G3CNZQ70XSBKVR15FQGJMFMZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2022-05-18T12:15:00-05:00"
recorded: "2022-05-18T17:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well.
BP 135/80, pulse 63, wt 187 lb.
Today: eGFR 72, K 4.3, UACR 357 mg/g, A1c 6.8%, LDL 104 mg/dL.
Reviewed with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-051866",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-051866",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
