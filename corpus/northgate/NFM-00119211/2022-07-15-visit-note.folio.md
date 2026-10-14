---
folio: "0.1"
id: "01G81TETY0207ZTCABDMK6AW3K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00119211"
effective: "2022-07-15T12:20:00-05:00"
recorded: "2022-07-15T15:58:00-05:00"
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
BP 126/77, pulse 85, wt 199 lb.
Today: eGFR 61, K 4.5, UACR 199 mg/g, A1c 8.2%, LDL 76 mg/dL.
A1c up, so empagliflozin started 10 mg daily today (A1c 8.2).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071544",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071544",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-071544",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
