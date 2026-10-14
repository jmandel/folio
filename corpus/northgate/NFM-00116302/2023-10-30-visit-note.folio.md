---
folio: "0.1"
id: "01HE136H80QJVZ8XXZFQNCJC1P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2023-10-30T10:50:00-05:00"
recorded: "2023-10-30T15:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new issues.
BP 107/65, pulse 88, wt 241 lb.
Labs 10/24: eGFR 61, K 4.2, UACR 29 mg/g, A1c 7%, LDL 92 mg/dL.
Reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-103036",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-103036",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-103036",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
